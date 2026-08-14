import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { discordProxy } from "./discord.functions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGuilds = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ token: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const res = await discordProxy({
      data: {
        token: data.token,
        endpoint: "/users/@me/guilds",
        method: "GET",
      },
    });

    if (res.status !== 200) {
      return { ok: false, error: "Falha ao obter lista de servidores." };
    }

    const guilds = JSON.parse(res.body) as any[];
    // Filter guilds where the user has MANAGE_GUILD (0x20)
    return { ok: true, guilds };
  });

const clonerInput = z.object({
  token: z.string(),
  originGuildId: z.string(),
  destGuildId: z.string(),
});

export const cloneServer = createServerFn({ method: "POST" })
  .inputValidator((data) => clonerInput.parse(data))
  .handler(async ({ data }) => {
    const { token, originGuildId, destGuildId } = data;

    // 1. Cleanup Destination (Remove existing channels and roles)
    const destChannelsRes = await discordProxy({
      data: { token, endpoint: `/guilds/${destGuildId}/channels`, method: "GET" },
    });
    if (destChannelsRes.status === 200) {
      const destChannels = JSON.parse(destChannelsRes.body);
      for (const ch of destChannels) {
        await discordProxy({
          data: { token, endpoint: `/channels/${ch.id}`, method: "DELETE" },
        });
        await sleep(500);
      }
    }

    const destRolesRes = await discordProxy({
      data: { token, endpoint: `/guilds/${destGuildId}/roles`, method: "GET" },
    });
    if (destRolesRes.status === 200) {
      const destRoles = JSON.parse(destRolesRes.body);
      for (const role of destRoles) {
        if (!role.managed && role.name !== "@everyone") {
          await discordProxy({
            data: { token, endpoint: `/guilds/${destGuildId}/roles/${role.id}`, method: "DELETE" },
          });
          await sleep(500);
        }
      }
    }

    // 2. Get Roles from Origin
    const rolesRes = await discordProxy({
      data: {
        token,
        endpoint: `/guilds/${originGuildId}/roles`,
        method: "GET",
      },
    });

    if (rolesRes.status !== 200) {
      return { ok: false, error: "Falha ao obter cargos da origem." };
    }

    const originRoles = (JSON.parse(rolesRes.body) as any[])
      .filter(r => !r.managed && r.name !== "@everyone")
      .sort((a, b) => b.position - a.position); // Higher position first

    const roleMap: Record<string, string> = {};

    // 3. Create Roles in Destination (Ordered)
    for (const role of originRoles) {
      const createRoleRes = await discordProxy({
        data: {
          token,
          endpoint: `/guilds/${destGuildId}/roles`,
          method: "POST",
          body: {
            name: role.name,
            permissions: role.permissions,
            color: role.color,
            hoist: role.hoist,
            mentionable: role.mentionable,
          },
        },
      });

      if (createRoleRes.status === 200 || createRoleRes.status === 201) {
        const newRole = JSON.parse(createRoleRes.body);
        roleMap[role.id] = newRole.id;
      }
      await sleep(500);
    }

    // 4. Get Channels from Origin
    const channelsRes = await discordProxy({
      data: {
        token,
        endpoint: `/guilds/${originGuildId}/channels`,
        method: "GET",
      },
    });

    if (channelsRes.status !== 200) {
      return { ok: false, error: "Falha ao obter canais da origem." };
    }

    const originChannels = JSON.parse(channelsRes.body) as any[];
    const categoryMap: Record<string, string> = {};

    // 5. Create Categories
    const categories = originChannels
      .filter((c) => c.type === 4)
      .sort((a, b) => a.position - b.position);

    for (const cat of categories) {
      const createCatRes = await discordProxy({
        data: {
          token,
          endpoint: `/guilds/${destGuildId}/channels`,
          method: "POST",
          body: {
            name: cat.name,
            type: 4,
            position: cat.position,
            permission_overwrites: cat.permission_overwrites?.map((ov: any) => ({
              ...ov,
              id: roleMap[ov.id] || ov.id,
            })),
          },
        },
      });

      if (createCatRes.status === 200 || createCatRes.status === 201) {
        const newCat = JSON.parse(createCatRes.body);
        categoryMap[cat.id] = newCat.id;
      }
      await sleep(1000);
    }

    // 6. Create Text/Voice Channels
    const nonCategories = originChannels
      .filter((c) => c.type !== 4)
      .sort((a, b) => a.position - b.position);

    for (const ch of nonCategories) {
      await discordProxy({
        data: {
          token,
          endpoint: `/guilds/${destGuildId}/channels`,
          method: "POST",
          body: {
            name: ch.name,
            type: ch.type,
            topic: ch.topic,
            bitrate: ch.bitrate,
            user_limit: ch.user_limit,
            position: ch.position,
            parent_id: ch.parent_id ? categoryMap[ch.parent_id] : null,
            permission_overwrites: ch.permission_overwrites?.map((ov: any) => ({
              ...ov,
              id: roleMap[ov.id] || ov.id,
            })),
          },
        },
      });
      await sleep(800);
    }

    return { ok: true, message: "Processo concluído. Servidor clonado!" };
  });

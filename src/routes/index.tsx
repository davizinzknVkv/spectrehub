/* aqi oq precisa pra pegar o resgatar 

curl --url ^"https://discord.com/api/v9/quests/1535343840557539408/claim-reward^" ^
  -H ^"accept: */*^" ^
  -H ^"accept-language: en-US,en;q=0.9^" ^
  -H ^"authorization: MTIxNzc5NTc1MDQwNzQ0MjQ3Mw.GZTaGl.7zndHHtRsORQbtR8XlaZxHMjMBVlAEz3x51QS4^" ^
  -H ^"content-type: application/json^" ^
  -b ^"__dcfduid=bf1394a09dbc11f1bb0af3f386a957f8; __sdcfduid=bf1394a19dbc11f1bb0af3f386a957f86d1b8345b05dfb2d0063872734c0bf40cdd2d7bcf7b45591f9e667921a13e712; locale=pt-BR; cf_clearance=iCj6nL8gLJIF.VHgPczH0cR1wLNxEpW56v784HgAKls-1787371912-1.2.1.1-Z_eUDr8i434MpDhEZ4VfEuDAkHXzsqsfYS6l591BCrWpIXi489tpeODe5FguiUCABUKU.8HZdiSmzFnEuAbeURlrmffF0tbc28eDRQ46O735.HMffpxBboICMIv8JW4nvXkJPAebTFzGppp5apTeAWKdMdPKNlaFLCrw_J1NxXDYS67w5Jj6tS2r31ogpDhTN5VUAzMuqJxmDq1zvJbvUDztw0ujtt7qeeNPYPoUDFZbnjinhnW4rw.ivzkUJCMHCmIyQXPwl2NPmu0h_dWvRBzU2geLBUZotiolt7557WCEYDRB4tBB_J_y.cFIVxnAGzg8T4WXzdg_lWFZ18hY2yaZZ9qfUTsi1x_CbgfHc_k; _cfuvid=p4aBXX.vR5SNTYRv_aweezJOtOPrYTDBtzz7bMNgyr4-1787371915.0299308-1.0.1.1-5gVPeWjrf9pZa_J1D9RVeD94Z6nVSxkb6Mve78LV7P0^\" ^
  -H ^"origin: https://discord.com^\" ^
  -H ^"priority: u=1, i^\" ^
  -H ^"referer: https://discord.com/quest-home^\" ^
  -H ^"sec-ch-ua: ^\^"Not=A?Brand^\^";v=^\^"99^\^", ^\^"Google Chrome^\^";v=^\^"151^\^", ^\^"Chromium^\^";v=^\^"151^\^"^\" ^
  -H ^"sec-ch-ua-mobile: ?0^\" ^
  -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^\" ^
  -H ^"sec-fetch-dest: empty^\" ^
  -H ^"sec-fetch-mode: cors^\" ^
  -H ^"sec-fetch-site: same-origin^\" ^
  -H ^"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36^\" ^
  -H ^"x-captcha-key: P1_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZCI6MCwiZXhwIjoxNzg3MzcyMTI2LCJjZGF0YSI6Imh6MGRhc1doQ1RKUEJ6eVpyaThFaEJVOHpleDhDUW0wcnJJWHNBMWkxdlpVcUVjSEpPc0xTM0cyNmo4OTBUWE4wVWhxY1dJMUFRNGtXaTNrT1piVlB4ckg5THhObnJpZUZSRkplb3k2bXcvalQvQmsvaG4zWUhpVWVwRWRzNHJJSjFkL3F6Q3k2QUV4MjFZcFF5akwwMGxjNzRwTHFvemN3Yk1TaElDaStYSXdidFR4UmtwQ21mNU5wMGF3RG52U0lvczkrKzZvK2xEVStzWkQ4aDQ5SWcxWEFkMDI5R3FaWmo5cEkyMHZCbmNtMWhNOWhIeHZyeFpnYnpwdDI4aWVlWk1vb3V4ZXFpTVhPdUhrUU5ocUptcDU4WS9uSmcwR0JMSlR1S0dqNEthOGJDWFlzbjE1ekVHR0JuZis3TTBQR0hkTWoyTURpdDgzZGhXVStmUE5xSEFsVjRPeE8yWGpqN3NkdXdId2hZZjU1YU9qSmJhT1paQjE4WmZLTnlqY3RkNWdXdlJ4MUFOcFNiSEhZMldnejZMU1BWZWdEdk9ubm5CMCIsInBhc3NrZXkiOiJCNHBSNWU0ZURuWDMyWHdMNVB3M0NBTFlHdmFxZkpFbFZ1U0hwK0Q1TWEvVVFONlp4b0M3QTdqSHU2Nk9EVnJ4MWl0WjFCZzZudHVhL3VNdE9wMjRiRkxmSlVNUEdzZEF0cHdSQzZHYi9wOFlZUXZxZ2Mwd3FkY3ZLN2k2aHN5YmlKRVVwY1ZLaHRHZURBVTI1Wm5rQ0dlbkExYW1nZTZJYmdOdnN6TUl4aVRDSGxGVE05M2hmNlVHTnFTcHJ6VFl6eGgxMWEwdFZHTGErVWNUK1NTN0x4MHR4eDJ5L0JkMFIyZ05qY09xM2pGVVNreWZrOURhOWRyS0NTVG16Szl0Vkd3em11WWJJdnNtM1VWelBYdUJhNHlHOTJCWW5aUGs4bGZIWmdIK1JmY2ZGQUxOakJ2NWk4YkIybWp1amVlYkpYWFowVkVWckJyRnBTL24zZVJFZlNWRFpEVjNaclFOK21oVjhjZFR2V3hNa3o2YUl3VXlseVZtZnpkd09qS2ZURTJmcWNLV3BGU2ZCTWtCZDJUT2VzbDBVay9mdzEycmp1K3h5azR1UDRRZXNSR1JSTDUxVGpFS0ZBZzVNU2N2QlVqdklQZ3ZyZ0xCVUtXODRjbGZsdWtpeWw5UWlrZXRTZ2R3TzJQNUFVVzV6UkJJYVE3L2dDZjRDUnAvQU52a2g1QUdEUlZnNjBPTFl0c2g3RllVcGZ5L1NEeU5nSGRHNlBFb2lUeDZCc0xoOUk1Wk0rc1I3OEpqQWo1YjZ1ZGpNdXVoaDZ5NnBKZmowcy8xRUdYOEh5SkNzeHRBYnFRUkNlWjR3bmd3eWdyRTd2YVJ5cTJnZ2NDTmdrUUxKQ0p0RVF0ejhpdUFGNm5FMVZjbDhKdndueXQ5UzdsNEFDYk9jMTFEUEpLOW9GQnZSVjNJbFRtOU1OSU1MNDVtK0VWR2V5Z2lOT1IwUkJKSHpXZHkxWDNTc240dGFRN1ZoelQ5enYwTmhFbDhWd1p2ZktIZC8zQnoyVVVOY1RNbDBGVDkzMGhhQmF1emVvOHVwcGpXei96RFdXbyt5dUFzcHNBMnJKRlN6SjllNXhCa2dhSUZ3QjRTN2ZhakRhUEtoSWgzZ29WUm9zRXJTeFFLUCtDcjRhU1l5QjYxTjJ3OFRuSEllM2Znb3VIYWhPZkRMdDRiQmFqSnl1VWd3aXoxbk9mTGMycWN5dEUreVp3Yy9wdVY3YmxBOStSUU1UdmlnZk1zNVkzRitVaUJBeTFDUHhIMGdwMzQvSENBQnVPWE5jaEV6NWczQW1lelJuVldTWjVFU2FhMFBvU2RGWGJWYXZabzVUekVVSW9FNjFRMUZKVGRuaERZb2lJcStSUnFqMjRYM0FSUFFsNXBtV2hhQXRKQU1RWi8yVFlBWjI2d29JeTFPMUtJNFFKaGhiOGVmVi94VjQ4aWVUNTF2NG1ISFNQRnlBTnM0eHFLMERpK1Q0R0RLZVFrdzc2ZWdmcUtQSGhzd3p3L1VwcDJyeWFLYk1iNGxSSDlDNnZNNE9iemRqWnA3bWJXWEZXS3dEaGlJejlSNk1mUDVrYkFPcENZSzVaQXVSbExQeGR3VDVkazMwb2JvNVdPNjlOV0JWRUZMdFM4Yk9NK1MxRjBhcUl5WTc4MEkrcnRmWGZoL3JiRnBJRERiQ0dWL3RtTndnMW10LzExVUJmbGxRUmxnN3lrbEsxVlpIelJIR0VvQUhuRXJQemRwVS85Vml6UGUyMXpMRUxQOFM4ZENocjYxZGhxOGdqS21NMUVodUVSZC9MQm13Y3A5bis2SzZ4bEh6cjFUNGtFMUE4eFJnbGpXYzRtZ2p3ZnJqWFFpeHEyOVVNc2IxTmZjbVZIRDRGZjdVY0hqSTk0NGVmK0xTL0JHOHRzOEs1aHcyVklXYVJBSi8wUHZZUkhGM2t6RTQzSVcrRHpZUTlYWmFDNVpFbi84cTA4b3d5Mk04b3A5dm9JZENLTk9wY1I4aUtNQTNaY1ArU2pmUnVJalMrM0I3Y0tseGNTNWpEa2xDODI2Umxwa1NDc1ZqZHNEUDFuclN4YS9XckttVGwyek1RVlYrNmZWYUV5YnZORWxRb2pxR2ZXaVMrcHlGUU96UFQrRk90d2VINk93bDBSeWsvMkhVMjFzbG14MjhOdml1MklUa2JCYWRqT1BrK0dLcGRWMjJPNkk2ekVlWTZSLzhnWDU1dXZERmhDTDdGTVF3ZUE3QTU0eW5LTWZSMmdRcm1mTk1XNlFxeDdEVjdPaUE0Ull5VVl4blJiQkMxYUpqQlFTSE95YWJBRHMvQWE5cll0K2FqSWgxdmcxZUVmVHVQb3dBSy9peVFmeEpNdmN6U3hPYjRwdTF5Mm1rM2F3MjFuZjhEWmMxaFJNcVJTVC9PUHdjaUppQldqeit1RGYyTUgxRzBoS3dsSG5CSGJyOWI1NE5DV0VpVGdJUGlmQ1VTcmhrckR5STdsaGdqOGFVa1BEQW9uRlp3TG9lTnJVell1anFFWVIrQVRnYmlzOGRDTXlTQnhkQVdrUlFvbklkV094N1IwaVhsdTlKejdmQSsyUWZJbEoxSXBqc2pDMGwzM09XT25JYWI1YjFZWDZEVTdCRTRIQ05NOSszSm5haG8xQjFDZEljbzdQMERHT29lQnZjaVF4TUtQL2kvUytXNFNVcEkwWU5tbjhYc1UwbTJrOHlVV1ZkVkpoa1hMMzZXeEQ2WDVGWVR0ZkhFU3RuSDZ0RFdDS2dGOW5mWHBmUWdXVWowSnptWEZjTnRFNjVkM0RuYUV4ZWZCZnhvVGtOSldzNFdaV25lWUxOTnRxSitVSmFNbjhhcVBxSHdwRGVEcHZRPT0iLCJrciI6IjMwODU5NjNmIiwic2hhcmRfaWQiOjMzNzUxNTgxMjJ9.WWcBS5bH8IatyKbbRUpfnEIWaqR5bMCsMfuFOrdjCcY^\" ^
  -H ^\"x-captcha-rqtoken: InR4S0JuWlZBMkx3VWNkeTJUWXEwUEU1SWd1QkRVRWpOVWd4M2xjd0lleXIxdmdoWVcrQlRTU1AxbU1ubTNMWTM2UEMwZGc9PXZoa3R1R3FwT2poekpOUW0i.aokhqg.HDeXuFLthfr7nDo4ZhnabZAve3M^\" ^
  -H ^\"x-captcha-session-id: c96de500-cc39-44c6-93d4-55dd39cacbea^\" ^
  -H ^\"x-debug-options: bugReporterEnabled^\" ^
  -H ^\"x-discord-locale: pt-BR^\" ^
  -H ^\"x-discord-timezone: America/Sao_Paulo^\" ^
  -H ^\"x-super-properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzE1MS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTUxLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiIiLCJyZWZlcnJpbmdfZG9tYWluIjoiIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjU5NTg5NywiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwiY2xpZW50X2xhdW5jaF9pZCI6IjYwYzYwZjc2LTIxNzUtNDIwOS1iYzkxLWE0ZmMzMjljOGRhNiIsImxhdW5jaF9zaWduYXR1cmUiOiJmZjVhZTQ4MC1kNzQyLTQyNzMtODMxZS1kMWE3YzYzYmEyZmIiLCJjbGllbnRfaGVhcnRiZWF0X3Nlc3Npb25faWQiOiI2ODEzYjE4Ni00Y2I1LTQwYzctODNmZi02YjRkMWU5ZTYyMDkiLCJjbGllbnRfYXBwX3N0YXRlIjoiZm9jdXNlZCJ9^\" ^
  --data-raw ^\"^{^\^\"platform^\^\":0,^\^\"location^\^\":11,^\^\"is_targeted^\^\":false,^\^\"metadata_sealed^\^\":null,^\^\"traffic_metadata_sealed^\^\":^\^\"eyJrZXlfZmluZ2VycHJpbnQiOiI4ZGUwNzVmMiIsInBheWxvYWQiOiJBWHdMd2dJS0N6WSszd2VVRGt0M09DTHRQNGIrTkkxeXdvb2hHQUNXdW1WenM1K1Nob24xVzVWQjk1QzUzLzNsNXBjN3BRd0xYT0JkUjR2L0ZIcHBvdGpaczNUa29kdis3b2o2VmdBPSJ9^\^"^}^" */
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { PRODUCTS, PLANS, REASONS } from "@/components/home/constants";
import { SiteHeader } from "@/components/home/SiteHeader";
import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { ProductsSection } from "@/components/home/ProductsSection";
import { ReasonsSection } from "@/components/home/ReasonsSection";
import { PlansSection } from "@/components/home/PlansSection";
import { FreeSignup } from "@/components/home/FreeSignup";
import { CommunitySection } from "@/components/home/CommunitySection";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/home/SiteFooter";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

const TITLE = "Spectre Hub — Elite Discord Automation";
const DESCRIPTION =
  "Domine o Discord com o Spectre Hub. Automação de quests, sniper de nicks raros e ferramentas de elite em uma infraestrutura obsidian premium.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://spectrehub.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://spectrehub.lovable.app/" },
      { rel: "preload", as: "image", href: logoAsset.url, fetchPriority: "high" },
      { rel: "preconnect", href: "https://discord.com" },
      { rel: "preconnect", href: "https://cdn.discordapp.com", crossOrigin: "anonymous" },
    ],
  }),
  component: Index,
});

const GUILD_ID = "1324600310286516255";
const GUILD_INVITE = "https://discord.gg/vbYK559Jnb";
const WIDGET_URL = `https://discord.com/api/guilds/${GUILD_ID}/widget.json`;

const FALLBACK_MEMBERS = [
  "davizinzkn",
  "rd9m",
  "fuam",
  "felipe",
  "biell",
  "lilith",
  "neo",
  "kaz",
  "mira",
  "juno",
  "hex",
];

function Index() {
  const { t } = useTranslation();
  const [liveMembers, setLiveMembers] = useState<{ id: string; name: string; avatar: string | null }[]>([]);
  
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(WIDGET_URL, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (j?.members && Array.isArray(j.members)) {
          setLiveMembers(j.members.map((m: any) => ({
            id: m.id,
            name: m.username,
            avatar: m.avatar_url
          })));
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  
  /* REDESIGN DA DOCUMENTAÇÃO — SITE PÚBLICO E INDEPENDENTE */

  return (
    <div
      id="topo"
      className="relative min-h-screen bg-obsidian font-sans text-foreground antialiased selection:bg-primary/30 flex flex-col"
    >
      <AnimatedBackground />

      <SiteHeader guildInvite={GUILD_INVITE} />

      <main className="relative z-10 flex-1">
        <Hero 
          guildInvite={GUILD_INVITE} 
          fallbackMembers={FALLBACK_MEMBERS} 
          liveMembers={liveMembers}
        />
        
        <SocialProof widgetUrl={WIDGET_URL} products={PRODUCTS} />
        <div id="produtos">
          <ProductsSection products={PRODUCTS} />
        </div>
        <div id="como-funciona">
          <ReasonsSection reasons={REASONS} />
        </div>
        <div id="planos">
          <PlansSection plans={PLANS} />
        </div>
        <FreeSignup guildInvite={GUILD_INVITE} />
        <div id="comunidade">
          <CommunitySection 
            widgetUrl={WIDGET_URL} 
            guildId={GUILD_ID} 
            guildInvite={GUILD_INVITE} 
            fallbackMembers={FALLBACK_MEMBERS} 
          />
        </div>
        <FinalCta guildInvite={GUILD_INVITE} />
      </main>

      <SiteFooter guildInvite={GUILD_INVITE} />
    </div>
  );
}
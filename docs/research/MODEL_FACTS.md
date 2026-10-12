# Verified model facts

Checked 11 October 2026 against manufacturer pages. These facts populate `src/data/models.ts`. Figures are manufacturer claims for the exact named variant, not measurements from this project. CV is metric horsepower; the UI must not label the same number as SAE hp or kW.

| Model | Combined power | 0–100 km/h | Top speed | Powertrain | Primary source |
| --- | --- | --- | --- | --- | --- |
| Revuelto | 1,015 CV | 2.5 s | >350 km/h | 6.5 L naturally aspirated V12 and three electric motors | [Lamborghini Revuelto](https://www.lamborghini.com/en-en/models/revuelto) |
| Temerario | 920 CV | 2.7 s | 343 km/h | 4.0 L twin-turbo V8 and three electric motors | [Lamborghini Temerario](https://www.lamborghini.com/models/temerario) |
| Urus SE | 800 CV | 3.4 s | 312 km/h | 4.0 L twin-turbo V8 and electric motor | [Lamborghini Urus SE](https://www.lamborghini.com/en-en/models/urus/urus-se) |

The Revuelto greater-than sign is part of the source figure and must remain. The Urus figures refer to **Urus SE**, not Urus S, Performante, or Urus SE Performante. Body colors are descriptive observations of the credited photographs; paint product names are not asserted.

## Engineering chapter verification

Checked the actual wording in `src/chapters/StoryChapters.tsx` on 2026-10-11 against the [official Revuelto model page](https://www.lamborghini.com/en-en/models/revuelto-models/revuelto). The page's embedded content data contains carousel and technical details omitted by the simplified text extraction. All four engineering claims are supported; no copy correction is required.

| UI claim | Supporting manufacturer section |
| --- | --- |
| Naturally aspirated 6.5-litre V12 | The V12 carousel describes natural aspiration; technical specifications give 6,498.5 cm³, rounded appropriately to 6.5 L. |
| Two front electric motors and a third rear motor | Hybrid-system data lists two front e-motors and a rear e-motor; the general specification identifies a front e-axle and rear P2-P3 eMotor. The Gearbox carousel also identifies the rear electric motor. |
| Carbon-fibre monofuselage | The Monofuselage content describes a carbon-fibre monocoque extended to the front end, with Forged Composites. This wording does not assert that every chassis component is carbon fibre. |
| Eight-speed dual-clutch transmission | The Gearbox carousel specifies eight speeds, dual clutches and transverse integration. |

The powertrain graphic is explicitly a concept schematic, not to scale. It should not be presented as a manufacturer engineering drawing or a precise component-location diagram. Motor output figures, motor flux type and chassis material percentages are intentionally not added to the UI.

## Malaysian pricing

No current Malaysian dealer quote covering taxes, duties, options and validity was verified for any of these three models. The application therefore uses **Price on request**. It must not imply that the concept can quote, sell, reserve stock, or accept payment.

A [manufacturer press release distributed by TheNewsMarket on 6 June 2024](https://www.thenewsmarket.com/news/lamborghini-urus-se--the-world-s-first-plug-in-hybrid-super-suv-debuts-in-malaysia/s/24baa61f-6f33-4b2d-92e1-e618a062c5ed) gave an Urus SE launch price of RM 1,028,000 before taxes, duties and customization. That historical launch figure is not a verified current on-the-road price and is intentionally absent from the model display. Aggregated prices and marketplace listings were not accepted as a current manufacturer quotation.

## Outbound official configuration

The official [Lamborghini Car Configurator](https://configurator.lamborghini.com/configurator/) was opened on 2026-10-11. The root `https://configurator.lamborghini.com/` redirected to that path. Keep outbound wording explicit; the local curated photo gallery does not guarantee orderable combinations or manufacturer availability.

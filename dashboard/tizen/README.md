# Still — installed Samsung TV app

Status: signed with StillTV, installed successfully, and launched on Samsung QN65S85FAFXZC at 10.0.0.4. Tizen confirmed a running process (PID 3853). The user confirmed the installed dashboard is visible on the TV. Individual app shortcuts and power-on startup behavior still require device testing.

Signed package: `.tools/Still.wgt`. Launch with `.tools/tizen-studio/tools/tizen-core/tz run -p StillHome1 -e 10.0.0.4:26101`. The current CLI expects the package ID, rather than the full application ID.

All UI assets live in this folder. No local server, pairing token, external website, or Mac connection is used at runtime. Tizen's Application API discovers and launches apps exposed by the TV. The first four recognized streaming apps appear as favorites; All apps expands the launchable list. Some firmware may restrict discovery or launching: this must be tested on the device.

## Install prerequisites

1. TV: Apps → App Settings → enter 12345 → Developer Mode On → Host PC IP 10.0.0.68 → restart.
2. Mac: install Samsung's supported TV developer tools and Samsung Certificate Extension. The base Tizen SDK is now installed under `.tools/tizen-studio`; Samsung TV and certificate extensions are being configured.
3. Connect to TV 10.0.0.4 using SDB. Create a Samsung author/distributor certificate profile including the TV's DUID, and permit installation. Samsung account sign-in may be required.
4. Build/package this folder using that certificate profile, install the signed .wgt, and launch application StillHome1.Dashboard.

The Samsung author certificate and private key must stay outside this source folder and Git.

The package is a regular installed Tizen TV application. It does not change the system's default launcher, intercept the Home key, or install a boot service. Power-on behavior requires separate model-specific verification.

Official guides:
- https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html
- https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html
- https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/command-line-interface.html


## Native startup configuration

User-approved experimental native Home/autostart configuration was applied. Exact original-value restore was tested successfully, then Still was reapplied. Native Home operation, home_appid, startup_appid, and booting_appid_backup now name StillHome1.Dashboard; auto_start is 1. The app remains eligible for boot. Real off/on confirmation is pending.

Standalone recovery: `python3 /Users/namakibiswas/Documents/ChatGPT/still-tv-recovery/run.py restore`. Preserve the recovery folder and original.json.


## Version 1.1.0

Installed expanded UI: Home, Apps, Search, Settings, and Get Apps. Includes installed-app search, pin/unpin/reorder favorites, hide/show apps, appearance themes, compact tiles, 12/24-hour clock, saved room/reminder preferences, ambient clock, and TV volume/mute controls. Store, input, Wi-Fi, Bluetooth, and picture/sound entries launch the TV's native panels; app installation is handled by Samsung Apps. The app does not implement Samsung's private catalog/download/account APIs or picture/Wi-Fi settings internals.

JavaScript syntax, manifest identity/version, native adapter volume/mute/store fallback, and browser search/edit/persistence checks passed. Native installation and launch succeeded. On-device feature confirmation is pending.

The SDK's `tz install` performed uninstall/reinstall, resetting local app data and native Home routing. The original baseline was restored and the approved Still Home/autostart configuration was reapplied and verified. Future updates should investigate Samsung's direct update installer to avoid uninstalling first.

Previous signed package and source are saved in `.tools/ui-before-1.1/`. Current signed package: `.tools/update-1.1/Still.wgt`. Startup recovery remains in `/Users/namakibiswas/Documents/ChatGPT/still-tv-recovery`.


## Version 1.1.1 — remote text fields

Installed directly via SDB vd_appinstall (no uninstall). All native Home/startup values remained assigned to Still; auto_start stayed 1. TV appearance preferences survived.

Native text fields now remain read-only while selecting them with the remote. OK enables editing and the Samsung keyboard. All keyboard arrows/text keys are left to the IME. Done advances room name → reminder → Save; search Done moves to results. Back/Cancel ends editing before dialog/page navigation. Both key names and Samsung numeric key codes are supported.

Five regression tests passed: `node --test dashboard/tests/remote.test.cjs`. Live TV tests through actual remote commands confirmed Down moves room-name → note-input, OK changes note-input to editable, and Back returns it to read-only with the editor still open. Native Web Inspector confirmed the updated source and no console errors during these checks.

Signed fix: `.tools/Still-111.wgt`. Installed from temporary `/home/owner/share/tmp/sdk_tools/StillRemote111.wgt`.

### 1.2.0 — themed logo tiles
Uses installed ApplicationInformation.iconPath images directly from the TV (Netflix path verified to load on-device), with a shared themed tile frame and separate readable app label in Home, Apps and Search. Native YouTube uses the installed wrapper's logo while retaining its preferred launch ID. Local YouTube/browser/TV Plus artwork covers known entries without an icon path. Failed images fall back to an app glyph. Samsung internal package namespaces are excluded except recognized consumer apps, reducing the misleading system-service library. Existing favorites, theme, remote IME handling and Home identity are preserved by direct vd_appinstall update.

Samsung native favorites have not been imported: automatic approval review blocked reading the private launcher data file. Await the user's ordered app names; do not claim native favorites synchronization or read the blocked file through another route.

### Theme-aware custom logos and light appearance

Tiles now use original theme-colored vector marks for recognized streaming apps and a generated initials mark for every other discovered app. Home, Apps, and Search share the same artwork. Appearance includes a saved Light option; panels, text, focus rings, dialogs, inputs, and ambient view follow it. Discovery no longer requires an explicit `show: true` or a consumer-package allowlist; explicit non-visible entries and known system utilities remain excluded. This lists apps exposed by the public Application API, rather than the Samsung store catalog.

Validation: JavaScript syntax checks, all five remote regression tests, eight preview-logo checks, unknown-app fallback, and light-theme script wiring passed. This source update has not yet been installed or visually verified on the TV.

### 1.2.1 installed — October 21, 2026

Signed `.tools/Still-121.wgt` with the existing StillTV profile and directly updated the connected TV at 10.0.0.4 using `vd_appinstall` without an uninstall. Installation completed at 100%; stopped the previous dashboard and successfully relaunched the updated app (PID 19475). Settings → Appearance now offers Light; shared custom vector logos replace native icon artwork. Five remote tests passed again. Visual confirmation on the physical TV remains pending.

### 1.2.2 — visually checked logo refinement

Inspected the actual localhost preview in Chrome. Removed the nested logo frame, restored recognizable brand colors with separate light-mode contrast colors, corrected the Netflix mark, centered labels, and replaced repetitive Open captions with a corner arrow. Visually checked dark Home, light Home, and the eight-app light library. Five remote tests passed. Signed `.tools/Still-122.wgt`, directly installed to the TV, and relaunched successfully. Local preview: http://127.0.0.1:8766 (serves `dashboard/tizen`, not the legacy `dist` dashboard).

### 1.2.3 — original brand assets

Replaced all hand-drawn brand interpretations with seven original files from official brand sites (YouTube, Netflix, Prime Video, Disney+, Spotify, Tubi, Samsung TV Plus). Exact provenance is in `icons/official/SOURCES.md`. Original colors, aspect ratios, and offline operation are preserved. Other installed apps use their public iconPath when available, with initials only as a fallback. Visually inspected localhost dark library and light Home, verified all seven images loaded, and passed five remote regression tests. Signed `.tools/Still-123.wgt`, directly updated the TV successfully, and relaunched it. Physical TV visual confirmation remains pending.

### 1.2.4 — transparent logo presentation

Removed individual logo backplates from Prime Video and Samsung TV Plus and replaced the Disney+ promotional background image with the transparent wordmark from the official Disney+ homepage. All three now sit directly on the shared tile surface. Light mode renders these marks black for contrast. Visually verified dark and light Home on localhost. Signed `.tools/Still-124.wgt`, directly installed successfully, and relaunched on the TV.

### 1.2.6 — Smart STB, Hoichoi, Bongo

Confirmed all three installed through the TV's app inventory: `BqyAmbj01d.SmartSTB`, `reAEEFwRi8.hoichoi`, `W5NuO0ABEj.Bongo`. Added a one-time migration that appends these apps to favorites and unhides them, preserving other preferences and subsequent manual edits. Discovery verifies missing entries with public getAppInfo before including them. Bundled original Smart STB artwork, Hoichoi's official app icon, and Bongo's official wordmark; sources are in icons/official/SOURCES.md. Browser preview includes all three. Visually verified the eight favorite tiles and confirmed all eight artwork images loaded. Five remote tests passed. Directly installed `.tools/Still-126.wgt` and relaunched successfully on the TV. Version 1.2.5 was an intermediate app-list update superseded by this release.

### 1.2.7 — smooth remote focus and Hoichoi wordmark

Replaced Hoichoi's square app icon with its full red wordmark. Added a shared animated focus frame, removed tile translation that disturbed directional geometry, and prevented automatic focus scrolling before requesting smooth nearest-item scrolling. Reduced-motion preference disables animation. JavaScript syntax checks and all five remote/IME regression tests passed. Signed `.tools/Still-127.wgt`, directly installed successfully, and launched on the TV. Physical remote feel remains for user confirmation.

### 1.2.8 — artwork for large screens

Audited all bundled image resolutions. Hoichoi now uses real SVG paths traced from the user's larger reference, replacing the 137px embedded bitmap. Bongo and YouTube use vector paths; Samsung TV Plus uses its official SVG. Tubi uses its original 1280px transparent artwork. Smart STB retains its gradient artwork with cropped, 4× Lanczos resampling (source detail remains limited). Existing Netflix, Spotify, Prime and Disney artwork already exceeds display sizes. Updated Bongo/Tubi theme styling and visually inspected rendered vector assets. JavaScript syntax and five remote tests passed. Signed `.tools/Still-128.wgt`, directly installed successfully and launched on TV; physical screen appearance awaits user confirmation.

### 1.3.0 — live local weather corner

Added an animated weather card beside the clock with temperature in Celsius, feels-like, daily high/low, humidity and wind. Sun/moon, clouds, rain, snow, fog and storm effects respond to Open-Meteo weather codes and day/night, run locally and respect reduced motion. User explicitly approved ipapi.co public-IP approximate city detection. Location is cached for six hours; weather refreshes every ten minutes while visible and on reconnect. Saved weather is marked offline; unavailable data never becomes fabricated local weather. Select the card to retry, use current location, or search and choose a city; native remote keyboard Done moves to Find city. Added only the three HTTPS service origins and Internet privilege to the Tizen manifest. Browser live preview detected Toronto and loaded actual weather, and the settings dialog was visually checked. Ten tests passed, including offline, zero-degree, lookup and condition mapping cases. Signed `.tools/Still-130.wgt`, directly updated successfully and launched on the TV. TV-specific service connectivity and physical appearance remain for on-device confirmation. Data documentation: https://open-meteo.com/en/docs and https://ipapi.co/api/.

### 1.3.1 — actual animated weather GIFs

Replaced the subtle CSS illustration with locally bundled looping GIFs for sun, night, partly cloudy, cloud, rain, snow, fog and storms. Sunny rays rotate visibly; precipitation falls continuously. Each 288px illustration plays on a 112–150px surface. Weather code selects the GIF without restarting unchanged animations. Generator: `dashboard/tools/build-weather-gifs.py`. Verified that all eight files contain multiple frames, loop indefinitely and have differing frame pixels; ten regression tests passed. Signed `.tools/Still-131.wgt`, directly installed successfully and launched. Physical TV GIF playback awaits user confirmation.

### 1.3.3 — 30-minute weather refresh

Changed automatic weather refresh from ten to thirty minutes while the app is visible. Startup, explicit Refresh and reconnect still fetch immediately; returning to the app refreshes when the interval has elapsed. Ten regression tests and syntax checks passed. Signed `.tools/Still-133.wgt`, directly installed and launched successfully on TV. Version 1.3.2 increased top navigation spacing and selection target widths, visually verified locally and installed successfully.

### 1.3.4 — hide weather update times

Removed update timestamps from the weather card, including cached/offline times. A brief offline indication remains when showing saved data. Thirty-minute automatic refresh is unchanged. Ten tests passed; signed `.tools/Still-134.wgt`, directly installed and launched successfully.

### 1.3.5 — complete installed-app list

Apps now includes every valid named entry returned by public getAppsInfo, including system/previously hidden entries, excluding only Still itself and repeated IDs. Removed visibility, name and package blacklists and name-based merging. Apps ignores Home/search hidden preferences, shows a count and refreshes on entry. Editor labels explain that hiding applies only to Home/search. Thirteen tests passed, including three catalog regressions. Signed `.tools/Still-135.wgt`, directly installed and launched successfully.

### 1.3.6 — direct TV settings shortcut

Home has a TV settings button alongside Inputs, Get apps, Sound and Calm clock, wired to the existing Samsung settings launcher. Home tools use five columns on large displays and two on narrow displays. Syntax and thirteen regression tests passed. Signed `.tools/Still-136.wgt`, directly installed and launched successfully. Opening the native settings panel from the new shortcut awaits physical TV confirmation.


### 1.3.7 — installed menu apps only

Corrected 1.3.5's unfiltered package list: Apps, Home and Search now require ApplicationInformation.show === true, Samsung's public menu-visibility flag. Background services and non-menu system entries are excluded without consumer-brand or package-prefix allowlists, so unfamiliar installed menu apps remain supported. Requested-app getAppInfo results pass through the same filter. Existing favorites and hidden preferences are preserved. The connected TV's SDB application inventory confirmed hundreds of internal packages were included by the previous logic. Syntax checks and thirteen regression tests passed. Signed `.tools/Still-137.wgt` and directly installed successfully without uninstalling. Physical TV list confirmation remains pending.


### 1.3.8 — consumer apps, verified on-device

Live public getAppsInfo inspection found 538 packages and 255 show:true entries; the flag also includes internal Samsung panels. Discovery now accepts visible generated store-package IDs, excludes the observed retail demo/manual/promotion packages and service categories, and explicitly retains native consumer app identities. Installed Samsung TV Plus is retained despite its false visibility flag. The YouTube wrapper and native target collapse to one native launch tile. Unknown native consumer IDs require adding to the native list; generated store apps are discovered dynamically. Six catalog regressions and all ten remote/weather tests passed. Directly installed `.tools/Still-138.wgt`; live Web Inspector verified version 1.3.8 and exactly 21 rendered library tiles: YouTube, Netflix, Prime Video, Disney+, Samsung TV Plus, Spotify, Amazon Alexa, Bongo, Chorki, CuriosityStream, Hoichoi, Internet, MagellanTV Documentaries, Perplexity, Samsung Health, Smart STB, SmartThings, TSN, Tubi, Windows 365 and Xbox. Restarted in normal operation after verification.


### 1.3.9 — consistent app artwork

Inspected actual 1920×1080 TV screenshots of all library rows and Home. Standardized native square icons to 80px with rounded corners; balanced wide wordmarks, reduced oversized Tubi/Hoichoi/Smart STB artwork, and retained compensation for whitespace in the original Netflix source. Added original offline Samsung Health and Windows 365 assets and the existing generic browser globe to replace failed native icons. All 21 library images loaded on-device with zero broken images or initials fallbacks. Dark library/Home and light Home were visually checked. Sixteen regression tests and logo JavaScript syntax passed. Directly installed the final `.tools/Still-139.wgt` and restarted in normal mode.

### 1.4.0 — horizontal app shelves and remote safe areas

Replaced Favorites, Apps and Search grids with single horizontal shelves. Remote navigation reveals offscreen tiles sideways while preserving the page's top and bottom padding. Reduced Home spacing, including a shorter-screen layout, to keep its primary controls together. Nineteen regression tests pass, including vertical clearance and horizontal scrolling. Signed `.tools/Still-140.wgt` and directly updated the connected TV on October 22, 2026 using vd_appinstall without uninstalling (100%, install completed). Relaunched successfully, PID 15999. Physical TV layout confirmation remains pending.

### 1.4.1 — simpler Home

Removed the Home shortcut row from display and remote navigation (Inputs, Get apps, Sound, TV settings, Calm clock). Existing Settings and store entry points remain available. JavaScript syntax passed. Signed `.tools/Still-141.wgt`, directly installed without uninstalling, and successfully relaunched on October 22, 2026.

### 1.4.2 — bottom-aligned Home content

Home now fills the TV viewport with favorites, reminder, and footer toward the bottom, preserving the safe-area padding and leaving flexible open space below the welcome/weather area. Small-screen responsive flow is retained. Signed `.tools/Still-142.wgt`, installed directly without uninstalling (100%, completed), and relaunched successfully on October 22, 2026. Physical TV visual confirmation remains pending.

### 1.4.3 — quiet footer and action labels

Reduced footer text/key badges to 9px and its closing caption to 8px. Removed launch arrows from app tiles and action labels; retained Hidden status for hidden apps. Footer navigation hint now says Arrows. JavaScript syntax and all nineteen regression tests passed. Signed `.tools/Still-143.wgt`, installed directly without uninstalling, and relaunched successfully on October 22, 2026.

### 1.4.4 — restore Apps grid

Restored the responsive grid in Apps, with vertical remote scrolling and safe-area clearance. Home favorites retain their horizontal shelf. Nineteen tests and remote JavaScript syntax passed. Signed `.tools/Still-144.wgt`, directly installed without uninstalling, and relaunched successfully on October 22, 2026.

### 1.5.0 — HDMI section below Home

Added Inputs & HDMI below the opening Home composition, accessible by scrolling down with the remote. The first-screen landing preserves bottom-aligned favorites, reminder and a small footer. Public tizen.systeminfo VIDEOSOURCE provides connected/disconnected HDMI ports; status refreshes every ten seconds while Home is visible, on return and manually. Saved per-port device labels allow names such as PS5, without claiming automatic device identification. Open input uses public tvwindow.setSource then hides the app; failures fall back to Samsung's inputs panel. API failure shows status unavailable rather than invented connectivity. Added public tv.window privilege. Local preview confirmed the section appears after scrolling. Twenty-three tests passed, including four HDMI adapter regressions. Signed `.tools/Still-150.wgt`, directly installed without uninstalling (100%, completed), and successfully relaunched on October 22, 2026. Actual HDMI status/switching and native naming-keyboard flow await physical TV confirmation.

API references: https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/systeminfo-api.html and https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvwindow-api.html

### 1.5.1 — live Settings volume

Settings now subscribes to Samsung's public TVAudioControl volume-change notifications and renders the event's actual volume, avoiding stale immediate getter values. While Settings is visible, a 500ms refresh also keeps mute/external changes synchronized and supports devices without notifications. On-screen volume/mute actions schedule a follow-up read after 100ms. Twenty-seven tests passed, including four audio regressions for stale getters, remote events, mute state, and notification fallback. JavaScript syntax passed. Signed `.tools/Still-151.wgt`, directly installed without uninstalling (100%, completed), and relaunched successfully on October 22, 2026. Physical TV timing confirmation remains pending.

### 1.5.2 — official refreshed Hoichoi SVG

Replaced the old traced Hoichoi logo with the original gradient SVG from the official site's header, matching the user's reference screenshot. The 3091.1×749.75 viewBox uses real paths, gradient fills, transparency, no embedded bitmap and no font dependency. Source recorded in icons/official/SOURCES.md. Signed `.tools/Still-152.wgt`, directly installed without uninstalling (100%, completed), and successfully relaunched on October 22, 2026.

### 1.5.3 — official-site vector logos

Reviewed the websites for the 21 installed app identities; Chorki's site could not be inspected successfully and current vector availability remains unverified. Added original path SVGs for YouTube, Netflix, Spotify, Bongo, Tubi, Curiosity Stream, Perplexity and TSN. Retained existing official Hoichoi and Samsung TV Plus vectors and existing Windows 365 artwork. Kept current official raster or installed icons for remaining apps where no suitable vector was found. Per-app findings, source URLs, and standalone rendering adjustments are recorded in icons/official/SOURCES.md. All eight new vectors loaded and were visually checked in dark/light browser previews; screenshot `.tools/official-vector-review.png`. All thirty tests passed and SVG XML parsed successfully, with no embedded bitmaps/scripts or remote dependencies in new assets. Signed `.tools/Still-153.wgt`, directly installed without uninstalling (100%, completed), and relaunched successfully on October 22, 2026. Physical TV appearance confirmation remains pending.


### 1.5.5 — glass cards and simpler Home

Removed the Home Inputs & HDMI section and its polling/rename UI from the loaded page. Preserved viewport-aligned Home layout through layout.js. App cards use translucent glass gradients and backdrop blur, with a 5.5% whole-card zoom on focus/hover instead of the app focus border; artwork and label scale together. Other controls retain their focus frame. Reduced-motion preferences disable the zoom transition. Thirty existing tests passed; browser preview checked. Signed `.tools/Still-155.wgt`, directly installed successfully without uninstalling and launched (PID 9022). Physical TV appearance confirmation remains pending.


### 1.5.6 — stronger card zoom

Increased whole-card focus/hover scale from 1.055 to 1.12 (12% enlargement). Signed `.tools/Still-156.wgt`, directly installed successfully and relaunched.


### 1.5.7 — enlarged cards with shadow clearance

Increased whole-card zoom to 15%. Expanded scroll shelf padding to preserve enlarged edges and soft shadows, adjusted remote horizontal reveal clearance to 48px, and spaced library edit actions below enlarged cards. Removed hover brightness filtering on glass cards. Light Home preview verified with the first card selected; screenshot `.tools/zoom-clearance-light.png`. Thirty tests passed. Signed `.tools/Still-157.wgt`, directly installed successfully and relaunched. Physical TV visual confirmation remains pending.


### 1.5.8 — glass throughout the dashboard

Shared translucent gradients, backdrop blur, restrained highlights and soft shadows across Settings panels, navigation, controls, search, reminder, store surfaces, dialogs, weather framing and toast. Theme-specific glass tint supports Forest, Charcoal, Warm and Light. Preserved 15% app zoom and shelf clearance. Dialog controls use their local focus outlines to prevent the overlay frame from overflowing blurred dialogs. Checked Forest/Light Settings and Light editor in browser; screenshot `.tools/glass-settings-158.png`. Thirty tests and syntax checks passed. Signed `.tools/Still-158.wgt`, directly installed without uninstalling and successfully launched. Physical TV appearance remains to be confirmed.


### 1.5.9 — selection within the glass surface

Removed the travelling focus-frame script from the loaded page and package. Controls now brighten, lift and scale locally on focus, with soft theme-specific shadows and no outline. Navigation uses a raised accent pill; selected theme uses a small status dot. Text fields retain a local border tint and soft glow. App zoom remains 15%. Reduced-motion preferences disable transitions. Light Settings remote selection preview verified; `.tools/glass-selection-159.png`. Thirty tests passed. Signed `.tools/Still-159.wgt`, directly installed successfully and relaunched. Physical TV appearance confirmation remains pending.


### 1.6.0 — lighter native TV rendering

Native runtime adds tv-rendering class. TV keeps glass gradients, sheen, theme colors, local selection and 15% app zoom, but disables per-surface backdrop filters and full-screen dialog blur. Slightly denser glass tint preserves readability without live blur. Only transform animates at 160ms; shadow and color updates no longer interpolate each frame. Layer hint applies only to focused controls. Browser preview retains full blur. Thirty regressions, syntax and packaged asset reference/native activation checks passed. Signed `.tools/Still-160.wgt`, directly installed successfully and relaunched. No measured on-device frame rate or physical smoothness confirmation yet. Previous `.tools/Still-159.wgt` remains available.


### 1.6.1 — Light glass depth

Light-only silver/blue backdrop, translucent cool glass surfaces, bright top edges, subtle shaded lower edges and restrained depth shadows. Nested controls contrast against the panels and focused controls have a clearer reflective surface. Dark themes retain their existing styling. Native no-blur/transform-only rendering remains intact. Thirty tests passed. Light Settings checked with tv-rendering class in a temporary browser preview (removed before packaging); `.tools/light-glass-161.png`. Signed `.tools/Still-161.wgt`, directly installed successfully and launched. Physical TV appearance confirmation remains pending.


### 1.6.2 — complete Settings ending

Bottom information panel wraps text/actions safely; reduced Settings spacing on shorter TV viewports and added footer clearance. Remote reveal includes the global footer when final Settings controls receive focus, provided the focused control still fits. Thirty-one tests passed including footer reveal and short-screen focus preservation. Browser arrow navigation verified complete panel/footer; `.tools/settings-footer-162.png`. Signed `.tools/Still-162.wgt`, directly installed and launched successfully. Physical TV confirmation remains pending.


### 1.6.3 — text-only Favorite/Edit selection

Excluded app-edit controls from generic raised glass focus styles. Favorite/Edit keeps its transparent text-only appearance in all themes, with a 6% left-anchored enlargement and brighter text on focus; no pill, border or shadow. Thirty-one regression tests passed. Signed `.tools/Still-163.wgt`, directly installed successfully and launched.


### 1.6.4 — dark text-field selection

Dark dialog inputs use inset glass with a restrained neutral highlight on focus. Search input stays transparent when selected; the outer search surface receives the highlight, avoiding a nested rectangular focus fill. Keyboard handling and native lightweight rendering retained. Thirty-one tests passed. Signed `.tools/Still-164.wgt`, directly installed and launched successfully. Visual TV confirmation remains pending.


### 1.7.0 — one target per app and explicit Edit mode

Apps header replaces Refresh/Get new apps with Edit/Done; discovery still refreshes on entry, and Samsung Apps remains accessible from Search and Settings. Removed separate Favorite/Edit controls under Apps/Search tiles. Normal OK launches; Apps Edit mode changes OK to the existing management dialog, with corner status/edit badges. Done/Back exits editing; navigation to other views clears editing. Home Arrange favorites enters Apps Edit mode. Re-render preserves app focus and closing management returns to the same app even after favorite/reorder changes. Browser verified mode entry, management, reorder/restore, focus restoration and Back exit. Thirty-five tests passed, including four mode/navigation regressions. Screenshot `.tools/apps-edit-170.png`. Signed `.tools/Still-170.wgt`, directly installed successfully and launched. Physical TV confirmation remains pending.


### 1.7.1 — personal Home illustration

Added user-supplied watercolor portrait on the left beside welcome copy. ImageGen removed the cream paper background and cropped empty space into a transparent asset at images/home-portrait.png. Original Downloads image retained. Static image has a gentle bottom alpha fade, no frame or focus target. Responsive hero keeps clock/weather clear and wraps on narrow displays; native lightweight rendering retained. Light and Forest Home browser previews checked, `.tools/home-portrait-light-171.png` and `.tools/home-portrait-dark-171.png`. Thirty-five tests passed. Signed `.tools/Still-171.wgt`, directly installed and launched successfully. Physical TV layout confirmation remains pending.


### 1.7.2 — remove header divider

Removed the horizontal border beneath Still and navigation. Signed `.tools/Still-172.wgt`, directly installed successfully and launched.


### 1.8.0 — spacious Home

Removed welcome headline/intro and clock caption. Enlarged left portrait, grouped clock/date on the right and replaced weather card with selectable city/temperature/condition text. Detailed weather backing IDs remain hidden for adapter compatibility; hidden weather GIF no longer loads/changes sources. Home secondary header clock hidden. Bottom favorites and existing reminder preference retained. Responsive layout and native lightweight rendering retained. Thirty-five tests and weather syntax check passed; browser preview `.tools/minimal-home-180.png`. Signed `.tools/Still-180.wgt`, directly installed successfully and launched. Physical TV confirmation remains pending.


### 1.8.2 — automatic sunrise/sunset appearance

Settings Appearance gains a saved, accessible Apple-style Automatic appearance switch. Uses weather-location sunrise/sunset Unix timestamps and UTC offset; Light between sunrise and sunset, preferred dark theme otherwise. Solar data must match the current location day, including UTC-midnight boundaries. Missing/stale/polar data falls back to local 7 AM–7 PM, labeled in Settings. Checks every 30 seconds, on weather updates and return to app. Manual swatch choice disables automatic mode and preserves the chosen night theme. Defaults to manual until enabled. Browser verified live Toronto solar times, daytime switching and manual override. Forty-five tests passed including time boundaries, offsets, stale fallback and weather adapter data. Screenshot `.tools/sunrise-appearance-182.png`. Signed `.tools/Still-182.wgt`, directly installed successfully and launched. Physical TV switch confirmation remains pending.

### 1.9.0 — local weather scenes

Weather effects originate at the screen’s top-right corner: sunny rays, clouds, moon/stars, fog, drizzle and rain intensity, freezing precipitation, snow, lightning and hail. Sunrise/sunset tint follows weather-location solar timestamps within a 30-minute window and remains beneath precipitation. Scene solar phase updates each minute independently of forecast refresh. Forty-nine regression tests and 112 browser weather/solar combinations passed; 115 screenshots and live Toronto response are saved in dashboard/weather-check/. Signed `.tools/Still-190.wgt`, directly updated via vd_appinstall (100%, install completed) and launched successfully on October 22, 2026, PID 18571. Physical TV appearance/performance confirmation remains pending.


### 1.9.2 — personal welcome and larger portrait

Restored text beside the portrait with “Namaki Biswas & Sanjay Dey” and “At home, together.” Enlarged the portrait to 520px maximum width with balanced vertical spacing to preserve favorites placement. Browser preview verified and saved at `.tools/personal-portrait-192.png`. Signed `.tools/Still-192.wgt` and directly installed successfully (100%, install completed) on October 22, 2026.

### 1.9.3 — Light navigation glass selection

Light-mode top navigation now uses a neutral translucent selected pill, brighter raised remote focus and dark slate text. Dark themes retain their theme-specific treatment. Browser previews checked for focused Apps while Home remains active, with computed text colour verified; saved `.tools/nav-light-193.png` and `.tools/nav-dark-193.png`. Signed `.tools/Still-193.wgt` and directly installed successfully on October 22, 2026. Physical TV appearance confirmation remains pending.


### 1.9.4 — fixed-size navigation focus

Removed navigation focus scaling in every theme, overriding the shared button zoom rule. Glass brightness/shading identifies focus within the same rounded pill. Browser computed transform and 30px corner radius verified in Light, Forest, Charcoal and Warm; `.tools/nav-no-zoom-194.png` saved. Signed `.tools/Still-194.wgt` and directly installed successfully on October 22, 2026.

### 1.9.5 — sliding glass navigation

Top navigation uses one continuously animated glass pill for remote focus and active-page selection, with a 420ms ease-out slide and reduced-motion support. Removes the separate remote outline for navigation targets. JavaScript syntax and all 49 regression tests passed. Signed `.tools/Still-195.wgt`, directly updated with vd_appinstall (100%, install completed) and launched successfully on October 22, 2026, PID 24110. Physical TV animation confirmation remains pending.

### 1.9.6 — load navigation animation

Corrected 1.9.5 wiring: focus.js was not referenced by index.html, so its navigation animation never ran. Extracted the selection controller into navigation.js and explicitly loaded it; bumped asset URLs to 1.9.6. All script paths and packaged navigation source verified, JavaScript syntax and 49 tests pass. Signed Still-196.wgt and direct vd_appinstall completed at 100% on October 22, 2026. Browser visual verification was unavailable because the browser policy blocked file URLs; physical TV animation confirmation remains pending.

### 1.9.7 — less repeated rendering

Only the visible app shelf renders at startup or after app/preference changes; Apps and Search render on first visit and retain their DOM until invalidated. Discovery still runs on Apps entry and return, but unchanged normalized catalogs preserve tiles, images, shelf position and focus. The minute-only clock updates on minute boundaries with duplicate-write protection and pauses while hidden; returning updates it immediately. Automatic appearance polling skips hidden/manual mode. Navigation selection skips geometry work when its target is unchanged and listens only to navigation focus. Native weather caps precipitation at 18 drops and eight hail particles, and all CSS animations pause while the app is hidden.

All 52 regression tests and changed JavaScript syntax checks passed, including new tests for lazy shelf rendering/invalidation, catalog refresh detection and clock writes. Signed `.tools/Still-197.wgt`, directly updated via vd_appinstall (100%, install completed) and launched successfully on October 22, 2026 (PID 25290). No on-device frame-rate benchmark was taken; physical remote smoothness remains for user confirmation. Previous `.tools/Still-196.wgt` is retained.

### 1.9.8–1.9.9 — footer and favorites edges

Removed the Arrows/Explore, OK/Select and Back/Home hints from both footers. Favorites now uses actual flex spacer boxes at both shelf ends rather than relying on trailing scroll-container padding, which older TV engines may omit from the scroll range. Each end reserves 48px including its gap; added matching scroll padding and proximity snapping. Signed `.tools/Still-199.wgt`, directly installed successfully (100%, install completed) and relaunched on October 22, 2026. Physical edge appearance remains for TV confirmation.

### 1.9.10 — favorites clip at content boundaries

User confirmed the row should clip at both content edges while the selected card remains visible. Removed Favorites’ negative horizontal margins; retained overflow clipping, end spacers and remote reveal clearance. Signed `.tools/Still-1910.wgt`, directly installed (100%, completed) and relaunched successfully on October 22, 2026. Physical TV visual confirmation pending.

### 1.9.11 — fully visible favorites

User corrected the clipping requirement: favorite cards should be complete. Favorites now uses an auto-fitting grid, wraps additional cards to another row, and allows visible overflow for selection zoom/shadows. Removed shelf spacer pseudo-elements for this view. Search remains a horizontal shelf. Signed `.tools/Still-1911.wgt`, directly installed successfully and relaunched October 22, 2026. Physical TV layout confirmation pending.

### 1.9.12 — restore scrollable favorites

Corrected the preceding interpretation: favorites stays a single horizontally scrollable row. Removed wrapping grid, retained physical end spacers, vertical zoom/shadow clearance and remote reveal inset. Disabled proximity snapping so it does not fight remote reveal. Signed `.tools/Still-1912.wgt`, directly installed successfully and relaunched October 22, 2026. Physical TV confirmation pending.

### 1.9.13 — Edit Favorites glass action

Renamed Arrange favorites to Edit Favorites and styled it as a compact glass button with 12px corners, theme-aware fill, subtle border and fixed-size focus highlight. Existing edit behavior retained. Signed `.tools/Still-1913.wgt`, directly installed successfully and relaunched October 22, 2026. Physical appearance confirmation pending.

### 1.9.14 — text-only Edit Favorites

Removed the glass background, border, radius and shadow from Edit Favorites in every theme and focus state. Remote selection uses brighter underlined text. Signed `.tools/Still-1914.wgt`, directly installed successfully and relaunched October 22, 2026. Physical TV visual confirmation pending.

### 1.9.15 — no underline

Edit Favorites stays plain text during selection, with only a text-color change. Removed underline. Signed `.tools/Still-1915.wgt`, directly installed successfully and relaunched October 22, 2026.

### 1.9.16 — text-only Apps Edit/Done

Apps Edit/Done now matches Edit Favorites: plain text, no glass, border, shadow or underline, with a text-color focus change in all themes. Signed `.tools/Still-1916.wgt`, directly installed successfully and relaunched October 22, 2026.

### 1.9.17 — Apps action alignment

Aligned installed-app count and Edit/Done on a shared baseline and removed the count's inherited hint margins. Signed `.tools/Still-1917.wgt`, directly installed successfully and relaunched October 22, 2026. Physical TV alignment confirmation pending.

### 1.9.18 — integrated search clear action

Replaced the boxed Clear label with an integrated × control, accessible Clear search name and 44px remote target. Removed nested glass/border/shadow, retained subtle circular focus feedback and prevented duplicate WebKit clear icons. Signed `.tools/Still-1918.wgt`, directly installed successfully and relaunched October 22, 2026. Physical TV appearance confirmation pending.

### 1.9.19 — slower shelf scrolling

Horizontal remote reveal now uses a 420ms ease-out animation in both directions, cancels pending motion when selection changes, and respects reduced motion. All 53 regression tests passed, including animation completion and direction reversal. Signed `.tools/Still-1919.wgt`, directly installed successfully (100%, install completed), and relaunched on October 22, 2026 (PID 29921). Physical TV animation feel remains for user confirmation.


### 1.9.20 — split-view Settings

Settings now uses an Apple TV-inspired one-third category sidebar and two-thirds detail pane, with Appearance, Sound & TV, and About Still. Adds larger typography, quiet surfaces, bright raised focus, category selection on remote focus, and a preserved Sound shortcut. All 55 regression tests passed. Signed `.tools/Still-1920.wgt` and directly updated the TV via vd_appinstall (100%, install completed) on October 22, 2026. Physical TV appearance confirmation remains pending.


### 1.9.21 — lunar phase

The nighttime Home moon now renders the illuminated limb and terminator from bundled SunCalc 1.9.0 calculations, refreshed with the minute weather-scene update. Waxing and waning light opposite sides; southern weather locations rotate the shape 180 degrees. Phase works offline and remains behind cloud effects. This decorative moon does not model moonrise/set or exact viewing-angle tilt. All 58 tests passed, including known new/full dates, terminator geometry and hemisphere orientation. Signed `.tools/Still-1921.wgt`, directly installed successfully (100%, install completed) and launched on October 22, 2026. Physical TV appearance confirmation pending.


### 1.9.22 — one moon stage per day

User-requested decorative 28-day cycle replaces astronomical illumination. Each TV-local calendar day has one of 28 stages; geometry changes once on the first scene refresh after midnight, or on resume. Repeated same-day refreshes make no geometry writes. Calendar arithmetic handles daylight-saving changes, and restarting retains the same date-derived stage. Cycle uses April 8, 2024 as its new-moon anchor; this intentionally differs from the natural roughly 29.5-day lunar period. Removed unused SunCalc dependency. All 59 tests pass. Signed `.tools/Still-1922.wgt`, directly installed (100%, install completed), and launched October 22, 2026.


### 1.9.23 — actual lunar cycle, once daily

Restores SunCalc astronomical lunar phase and illumination in place of the artificial 28-day loop. Samples local noon for each TV-local calendar date so the shape stays fixed all day, changes on the first scene refresh after midnight or resume, and survives restarts consistently. Hemisphere orientation retained. All 59 tests pass, including known new/full dates, no 28-day repeat, no same-day geometry writes and daylight-saving transitions. Signed `.tools/Still-1923.wgt`, directly installed successfully (100%, install completed) and launched October 22, 2026.


### 1.9.24 — realistic lunar surface and shading

Projects bundled NASA SVS LROC color-map imagery onto a small 192px canvas sphere. Daily astronomical phase supplies sunlight direction; continuous surface-normal shading softens the curved terminator, with faint dark-side detail and an antialiased limb. Existing once-per-local-day update, hemisphere flip, cloud layering and SVG fallback retained. No per-frame rendering or runtime texture downloads. Attribution in images/SOURCES.md. All 60 regression tests passed; headless Chrome verified texture pixels, phase shading and no page errors, with preview at `.tools/moon-realistic-1924.png`. Signed `.tools/Still-1924.wgt`, directly installed successfully (100%, install completed) and launched October 22, 2026. Exact observer tilt, libration and crater relief are not modeled; physical TV appearance confirmation pending.


### 1.9.25 — softly illustrated moonlight

Adds a warm ivory/cool blue halo around the textured moon, with a slightly warmer, brighter surface finish to complement the illustrated portrait. Halo strength follows daily illumination and shifts toward the lit side; it disappears at new moon and has no pulsing animation. Actual lunar calculation, daily updates and shading retained. All 60 tests passed, and browser texture render checked without page errors. Signed `.tools/Still-1925.wgt`, directly installed successfully (100%, install completed), and launched October 22, 2026. Physical TV glow confirmation pending.


### 1.9.26 — watercolor lunar illustration

Replaces photographic surface rendering with a detailed AI-generated watercolor/ink interpretation of the NASA lunar map, using the home portrait as a style reference. Recognizable crater rings, ray systems and dark maria remain as illustrated features; exact scientific terrain fidelity is not claimed. Actual phase shading, once-daily updates and halo retained. Asset saved locally as images/moon-map-illustrated.png; original map preserved. All 60 tests pass and browser texture rendering verified without page errors. Signed `.tools/Still-1926.wgt`, directly installed successfully (100%, completed), and launched October 22, 2026.


### 1.9.27 — minimalist handmade lunar surface

Uses a simpler AI-generated acrylic/ink lunar map adapted from the user’s paper-cover illustration prompt: broad dark maria, sparse crater marks, four restrained main color families, organic brush edges and subtle paper texture. Replaces dense crater detail while retaining daily actual-phase shading and the soft halo. Original and previous illustrated maps preserved. All 60 tests passed and browser rendered texture pixels without page errors. Signed `.tools/Still-1927.wgt`, directly installed successfully (100%, install completed), and launched October 22, 2026.


### 1.9.28 — lighter painted moon patches

Lifts darker lunar pigment colors before applying phase lighting, softening the illustrated maria without brightening the astronomical shadow. Five lunar regression tests and browser texture check passed. Signed `.tools/Still-1928.wgt`, directly installed successfully (100%, install completed), and launched October 22, 2026.


### 1.9.29 — pale reference-style moon

Matches the user’s reference with near-white lunar highlands, subtle light-gray illustrated maria, and a softer gray phase shadow. Maps albedo to a restrained 208–255 grayscale range before phase lighting; raises artistic shadow ambient to 55% to remove the black hemisphere. Phase geometry still follows daily astronomical calculation, while brightness is intentionally illustrative. Five lunar tests and headless browser render passed (visible pixel brightness 115–255). Signed `.tools/Still-1929.wgt`, directly installed successfully (100%, install completed), and launched October 22, 2026. Refresh local preview to load changed assets.


### 1.9.30 — Obsidian OLED appearance

Replaces Forest with Obsidian: pure black background, near-black panels, neutral accents and no full-screen tint. Existing Forest preferences resolve to Obsidian, including automatic night appearance. Charcoal and other themes retain their styles. All 61 regression tests passed. Signed `.tools/Still-1930.wgt`, directly updated the TV via vd_appinstall (100%, install completed), and relaunched successfully (PID 28315) on October 22, 2026. Physical TV appearance confirmation pending.


### 1.9.31 — automatic appearance focus

Corrects inherited label color on the bright focus surface, rounds the automatic appearance row, and improves switch and schedule contrast. Visually verified focused Obsidian settings in localhost. Signed Still-1931.wgt and directly installed successfully (100%, install completed).


### 1.9.32 — matching rounded highlights

Applies the automatic appearance row’s 14px corner radius to other Settings rows and focused buttons. Volume circles retain their round shape. Signed Still-1932.wgt, directly installed successfully at 100%, and relaunched on the TV.


### 1.9.33 — round only the highlighted row

Restores straight idle Settings row dividers, including automatic appearance. Rounded 14px corners apply only during focus. Signed Still-1933.wgt, directly installed successfully (100%, install completed), and relaunched on the TV.


### 1.9.34 — preference switches

Replaces text On/Off values for 24-hour clock, compact tiles and reminder with accessible switches matching automatic appearance. Uses aria-checked and retains saved preferences. All 61 tests pass; browser toggle and focus visually verified. Obsidian Home, Apps and Settings screenshots refreshed.


### 1.9.35 — Settings sidebar focus contrast

Selected category background had higher specificity than the general bright focus background, leaving dark focused text on a dark selected surface. Explicit category focus rules now keep a bright surface and dark readable labels together, including the selected category. All 61 tests passed. Signed `.tools/Still-1935.wgt`; TV upload failed when the SDB connection dropped, and reconnect to 10.0.0.4:26101 failed. After restarting the local SDB server, reconnected successfully, directly installed the signed update (100%, install completed), and launched StillHome1.Dashboard successfully. Physical TV contrast confirmation remains pending.


### 1.9.36 — weather clarity, app artwork and immediate tabs

Removes the rectangular lunar halo edge, adds recognizable clouds, improves light-theme precipitation contrast, and renders branched snowflakes sized by snowfall intensity. App tiles use opaque surfaces with balanced logo sizing and readable Tubi artwork. Focusing a top navigation item switches its page immediately while retaining navigation focus. Local light/dark previews verified; deployment results are reported separately.


### 1.9.37 — theme Up navigation

Up from each theme swatch explicitly targets Automatic Appearance, avoiding the top Settings tab when geometric navigation favors its horizontal position. Hidden or disabled targets remain excluded and dialog scope is retained. Regression coverage includes all four theme positions.


### 1.9.38 — distinct top navigation focus

The active tab keeps a muted pill while focus is in page content. Returning remote focus to the top navigation brightens the pill and adds a subtle outline in both light and dark themes. The existing sliding pill and immediate tab switching remain.


### 1.9.39 — return from Appearance to Settings

Up from Automatic Appearance explicitly returns to the top Settings tab, preventing geometric focus from landing on Apps and switching away.


### 1.9.40 — enter Appearance from the top tab

Down from the top Settings tab targets Automatic Appearance before the theme row. If the Appearance pane is hidden, normal visible-target navigation remains available.

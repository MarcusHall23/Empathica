Add a new feature to the History page called **“Add Entry”** that allows users to manually log a past interaction.

**1. Add Entry Button**

* Place a button labeled **“Add Entry”** at the top of the History page.
* Style it consistently with the app’s UI (rounded card-style button).
* When tapped, it should open a **full-screen modal form** inside the phone UI.

**2. Modal Title**
Title at the top: **“Add Manual Entry”**

This form allows the user to manually record a social interaction that was not captured live.

**3. Form Fields**

Include the following fields:

**Atmosphere Score**

* A slider or segmented control that allows the user to select the atmosphere they felt during the interaction.
* Range: from negative to positive atmospheres (for example: hostile → tense → neutral → calm → positive).
* Display the selected atmosphere clearly.

**Key Insights**

* A dropdown or multi-select menu.
* The options should include insights from **all atmosphere categories**, not just the selected atmosphere.
* Examples of insights:

  * defensive body language
  * avoiding eye contact
  * open posture
  * smiling
  * nervous laughter
  * short responses
  * engaged conversation
  * mirroring body language

Users should be able to select **multiple insights** they noticed during the interaction.

**Battery Change**

* A numeric input or slider where the user can manually enter the **battery percentage impact** of the interaction.
* Example: -15% or +10%.

**Attraction Score**

* This field should remain **blank or disabled** because the interaction was not recorded live.

**Lie Detection Score**

* This field should also remain **blank or disabled** for manual entries.

**4. Save Interaction**
Add a **“Save Entry”** button at the bottom of the modal.

When saved:

* The entry should appear in the History list.
* It should look similar to other interactions but with a **clear label such as “Manual Entry” or “User Added”** so users can distinguish it from live-recorded sessions.

**5. Visual Distinction**
Manual entries should be visually different from live sessions:

* Include a small **“Manual Entry” tag or badge**.
* Keep the attraction and lie detection fields empty or marked as unavailable.

**Design Style**
Maintain the existing app aesthetic:

* Soft rounded cards
* Minimal layout
* Clean typography
* Subtle gradients and blur effects where appropriate.

Improve the existing Empathica mobile app UI by fixing stale values and introducing dynamic, editable interaction data.

Empathica is a social perception and wellness app that visualizes emotional atmosphere, social energy, and interaction insights.

Add the following product improvements and UI behavior:

Editable Interaction History
Users should be able to edit or remove past interaction events.

Each history entry should include an edit menu (three-dot icon).

Users can delete an event or modify its details (interaction name, battery impact, emotional atmosphere score).

When an event is edited or removed, the change should automatically update the Activity page and the Home dashboard.

Dynamic User Name
The name displayed across the app should come from the user's name entered in the Settings screen.

The Home screen greeting should display the user's name dynamically.
Example: “Good morning, Marcus.”

Time-Based Greeting
The welcome message on the Home screen should change depending on time of day:

5:00–11:59 → “Good morning”

12:00–17:59 → “Good afternoon”

18:00–4:59 → “Good evening”

Social Emotional Battery Logic
The Social Emotional Battery displayed on the Home dashboard should reflect the net total calculated from interaction history.

Each interaction in History affects the battery level positively or negatively.

The Home battery should always reflect the total remaining energy for the day.

Daily Reset Behavior
The battery should reset to 100% after the user sleeps or at the start of a new day.
After reset, interactions during the day should gradually decrease or increase the battery based on their impact.

UI Feedback

When an interaction is edited or deleted, the battery meter and dashboard metrics should update immediately.

Include smooth UI animations for battery changes.

Ensure data consistency between Home, Activity, and History screens.

Design style should remain consistent with the existing Empathica UI:

Minimal Apple-style design

Rounded cards

Soft gradients reflecting emotional atmosphere

Friendly wellness-focused tone
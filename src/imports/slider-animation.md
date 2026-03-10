### 8. Slider Animation on Insight Selection

When a new **Key Insight** is selected and it changes the estimated **Atmosphere** or **Battery** values, the sliders should **animate smoothly to the new value** instead of instantly jumping.

#### Trigger

The animation should trigger whenever:

* A Key Insight is **selected**
* A Key Insight is **deselected**
* The automatic calculation updates Atmosphere or Battery

The animation should **not trigger** if the user manually edits the slider.

---

### Animation Behavior

When the value changes:

1. The slider **thumb moves smoothly from the current value to the new calculated value**.
2. The filled portion of the slider track should **grow or shrink continuously** with the thumb.
3. The numeric value should **count up or down smoothly** during the motion.

Avoid instantly snapping to the new value.

---

### Motion Style

Use a short, smooth easing motion similar to modern UI microinteractions.

Recommended animation properties:

* duration: **0.35–0.5 seconds**
* easing: **easeOut** or **easeInOut**
* animation type: **interpolated value change**

The movement should feel responsive but natural, not slow or bouncy.

---

### Multiple Insight Changes

If several insights are added quickly:

* Animate from the **current slider position to the latest calculated value**
* Do not queue multiple animations.

---

### Design Goal

The animation should help users visually understand **how their selected insights influence the Atmosphere and Battery values**, reinforcing the relationship between observations and the estimated interaction state.

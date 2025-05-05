// src/pages/StepCompassion.jsx
import CompassionPointsSlider from '../../components/request/CompassionPointsSlider';
import { useRequestForm } from '../../context/RequestFormContext';

export default function StepCompassion() {
  const { form, updateForm } = useRequestForm();

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700">
        How much effort or urgency does this task require? This helps volunteers understand the impact.
      </p>

      <CompassionPointsSlider
        value={form.compassionLevel}
        onChange={(val) => updateForm('compassionLevel', val)}
      />
    </div>
  );
}

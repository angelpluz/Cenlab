import OgchStaticRosterTracker from "@/components/ogch/OgchStaticRosterTracker";
import { OGCH_STATIC_ROSTERS } from "@/lib/ogch-static-rosters";

export default function OgchDancerTracker() {
  const config = OGCH_STATIC_ROSTERS.dancer;

  return (
    <OgchStaticRosterTracker
      activeNav={config.activeNav}
      characters={config.characters}
      introLabel={config.introLabel}
      jobLabel={config.jobLabel}
      nextAvailableAt={config.nextAvailableAt}
      sourceLabel={config.sourceLabel}
    />
  );
}

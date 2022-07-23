// distance.tsx - Distance component that calculates the distance from home to office
//              - and calculate the cost of driving each year.

// According to google, Americans/Canadians? commute 260 times (round trips) per year 
const commutesPerYear = 260 * 2;

// 10 liters of gas per kilometer
const litresPerKM = 10 / 100;

const gasLitreCost = 1.5;
const litreCostKM = litresPerKM * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

// Render the distance
export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  // Days spend in car
  const days = Math.floor(
    commutesPerYear * leg.duration.value / secondsPerDay
  );

  // Cost
  const cost = Math.floor(
    (leg.distance.value / 1000) * litreCostKM * commutesPerYear
  );

  return (<div>
    <p>
      This home is <span className="highlight">{leg.distance.text}</span> away from your office.
      That would take <span className="highlight">{leg.duration.text}</span> each direction.
    </p>

    <p>
      That's <span className="highlight">{days} days</span> in your car, each year at a cost of <span className="highlight">${new Intl.NumberFormat().format(cost)}</span>.
    </p>
  </div>);
}

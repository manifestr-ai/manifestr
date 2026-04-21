import HighActivityCohorts from './HighActivityCohorts'
import ChurnRiskHeatmap from './ChurnRiskHeatmap'
import AiFrustrationAlerts from './AiFrustrationAlerts'

export default function PredictiveSignalsSection({ data }) {
  if (!data) return null

  return (
    <div className="flex flex-col gap-[18px]">
      <HighActivityCohorts data={data?.highActivityCohorts} />

      <div className="flex flex-col lg:flex-row gap-[18px] items-stretch">
        <ChurnRiskHeatmap data={data?.churnRiskHeatmap} />
        <AiFrustrationAlerts data={data?.aiFrustrationAlerts} />
      </div>
    </div>
  )
}

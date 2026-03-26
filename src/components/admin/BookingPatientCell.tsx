type Props = {
  cellData?: unknown
  linkURL?: string
  rowData?: {
    patient_email?: string | null
    patient_phone?: string | null
  }
}

export function BookingPatientCell({ cellData, linkURL, rowData }: Props) {
  const patientName = typeof cellData === 'string' && cellData.trim() ? cellData : 'Open booking'
  const patientEmail =
    typeof rowData?.patient_email === 'string' && rowData.patient_email.trim() ? rowData.patient_email : null
  const patientPhone =
    typeof rowData?.patient_phone === 'string' && rowData.patient_phone.trim() ? rowData.patient_phone : null

  return (
    <div className="booking-patient-cell">
      {linkURL ? (
        <a className="booking-patient-cell__name" href={linkURL}>
          {patientName}
        </a>
      ) : (
        <span className="booking-patient-cell__name">{patientName}</span>
      )}
      {patientEmail ? (
        <a className="booking-patient-cell__meta" href={`mailto:${patientEmail}`}>
          {patientEmail}
        </a>
      ) : null}
      {!patientEmail && patientPhone ? <span className="booking-patient-cell__meta">{patientPhone}</span> : null}
    </div>
  )
}

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, position: "relative" },

  watermark: {
    position: "absolute",
    top: "40%",
    left: "25%",
    fontSize: 60,
    opacity: 0.15,
    transform: "rotate(-30deg)",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  logo: { width: 70, height: 70 },

  schoolName: { fontSize: 18, fontWeight: "bold" },

  title: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  card: {
    border: "1 solid #ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  label: { fontWeight: "bold" },

  footer: {
    marginTop: 25,
    fontSize: 10,
    textAlign: "center",
    color: "grey",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },

  signBox: { textAlign: "center" },

  qr: { width: 90, height: 90, marginTop: 10 },
});

export function ReceiptPDF(data: {
  receiptNo: string;
  studentName: string;
  feeName: string;
  term: string;
  amount: number;
  method: string;
  reference: string;
  date: string;
  status: "PAID" | "PENDING";
  logoUrl?: string;
  qrCode: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* WATERMARK */}
        <Text style={styles.watermark}>{data.status}</Text>

        {/* HEADER */}
        <View style={styles.headerRow}>
          {data.logoUrl && <Image src={data.logoUrl} style={styles.logo} />}
          <View>
            <Text style={styles.schoolName}>School Finance Office</Text>
            <Text>Official Payment Receipt</Text>
          </View>
        </View>

        <Text style={styles.title}>RECEIPT</Text>

        {/* RECEIPT INFO */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt No</Text>
            <Text>{data.receiptNo}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text>{data.date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Student</Text>
            <Text>{data.studentName}</Text>
          </View>
        </View>

        {/* PAYMENT INFO */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Fee</Text>
            <Text>{data.feeName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Term</Text>
            <Text>{data.term}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text>{data.amount} FCFA</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Method</Text>
            <Text>{data.method}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Reference</Text>
            <Text>{data.reference}</Text>
          </View>
        </View>

        {/* QR */}
        <View style={{ alignItems: "center" }}>
          <Text>Scan to verify receipt</Text>
          <Image src={data.qrCode} style={styles.qr} />
        </View>

        {/* SIGNATURES */}
        <View style={styles.signatureRow}>
          <View style={styles.signBox}>
            <Text>___________________</Text>
            <Text>Bursar</Text>
          </View>

          <View style={styles.signBox}>
            <Text>___________________</Text>
            <Text>Official Stamp</Text>
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
          This is a system-generated receipt. Verify authenticity using QR code.
        </Text>
      </Page>
    </Document>
  );
}

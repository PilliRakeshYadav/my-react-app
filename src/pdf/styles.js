import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 25,
    right: 25,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottom: "1px solid #ccc",
  },
  headerLogo: {
    width: 150,
    height: 50,
    objectFit: "contain",
  },
  headerCircle: {
    width: 55,
    height: 55,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCircleImg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  headerPageNumber: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #ccc",
    paddingTop: 20,
    fontSize: 10,
  },

  fullPageImage: {
    width: "100%",
    height: "100%",
  },

  page: {
    paddingTop: 100,
    paddingBottom: 80,
    paddingHorizontal: 40,
  },

  dateText: {
    textAlign: "right",
    marginBottom: 10,
  },

  appHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  appHeaderText: {
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  table: { borderWidth: 1, borderColor: "#999", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableRowBorderTop: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#999",
  },
  tableCellLeft: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#999",
  },
  tableCellRight: { flex: 1, padding: 8 },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
  },
  sectionHeader: {
    color: "#d35400",
    fontSize: 16,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: "#999",
    marginVertical: 8,
  },
  subDivider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    flex: 3,
    color: "#d35400",
    fontWeight: "bold",
  },
  value: {
    flex: 7,
    fontSize: 12,
    lineHeight: 1.4,
  },
  valueBlock: {
    flex: 7,
    fontSize: 12,
    lineHeight: 1.4,
  },

  orangeText: {
    color: "#d35400",
    marginTop: 5,
  },

  iconComparison: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  iconBlock: { alignItems: "center" },
  iconImage: { width: 90, height: 90 },

  ratingRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
},

ratingImage: {
  width: 80,
  height: 16,
  objectFit: "contain",
},

ratingValue: {
  marginLeft: 8,
  fontSize: 12,
  color: "#333",
},
  futureTitle: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#d35400",
  },
});

export default styles;

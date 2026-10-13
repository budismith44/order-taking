const SHEET_NAME = "Orders"

function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Jogja Sky Lounge — Taking Order")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
}

function saveOrder(order) {
  const sheet = getOrderSheet_()
  sheet.appendRow([
    new Date(),
    order.id,
    order.customer,
    order.table,
    order.items,
    order.note || "",
    order.orderedAt,
    order.deliveredAt || "",
    order.status,
  ])
  return { ok: true, id: order.id }
}

function getOrders() {
  const sheet = getOrderSheet_()
  const rows = sheet.getDataRange().getValues()
  if (rows.length < 2) return []
  return rows
    .slice(1)
    .map(function (row) {
      return {
        id: row[1],
        customer: row[2],
        table: row[3],
        items: row[4],
        note: row[5],
        orderedAt: row[6],
        deliveredAt: row[7],
        status: row[8],
      }
    })
    .reverse()
}

function updateOrderStatus(order) {
  const sheet = getOrderSheet_()
  const rows = sheet.getDataRange().getValues()
  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index][1] === order.id) {
      sheet
        .getRange(index + 1, 8, 1, 2)
        .setValues([[order.deliveredAt || "", order.status]])
      return { ok: true, id: order.id }
    }
  }
  return { ok: false, id: order.id }
}

function deleteOrder(orderId) {
  const sheet = getOrderSheet_()
  const rows = sheet.getDataRange().getValues()
  for (let index = rows.length - 1; index >= 1; index -= 1) {
    if (rows[index][1] === orderId) {
      sheet.deleteRow(index + 1)
      return { ok: true, id: orderId }
    }
  }
  return { ok: false, id: orderId }
}

function getOrderSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
    sheet.appendRow([
      "Timestamp",
      "Order ID",
      "Customer",
      "Table",
      "Items",
      "Note",
      "Ordered At",
      "Delivered At",
      "Status",
    ])
    sheet.setFrozenRows(1)
  }
  return sheet
}

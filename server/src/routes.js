const express = require("express");
const contract = require("./controller.js");
const routes = express.Router();

routes.get("/get_all_meds", contract.queryAllMedication);
routes.get("/get_all_presc", contract.queryAllPrescription);
routes.get("/get_all_sells", contract.queryAllSales);
routes.get("/init_ledger", contract.initLedger);
routes.post("/create_med", contract.createMedication);
routes.post("/create_pres", contract.createPrescription);
routes.post("/sell_med", contract.sellMedication);
routes.get("/health", async (req, res) => {
    return res.send({teste: "ok"});
});
module.exports = routes;

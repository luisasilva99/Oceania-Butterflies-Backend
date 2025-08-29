import ButterflyModel from "../models/ButterflyModel.js"

// GET all butterflies
export const getAllButterflies = async(req, res) => {
    try {
        const butterflies = await ButterflyModel.findAll()
        res.status(200).json(butterflies)
    } catch  (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

//GET one butterfly
const getOneButterfly = async(req, res) => {
    try {
        const { id } = req.params;  // sacamos el id de la URL
        const butterfly = await ButterflyModel.findByPk(id)  // buscamos por la PK
        
        if (!butterfly) { //si NO existe
            return res.status(404).json({ message: "Butterfly not found"});
        }
        res.status(200).json(butterfly); // si existe la enviamos
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
//DELETE one butterfly
const deleteButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await 
        ButterflyModel.findByPk(id);

        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found"});
        }
        
        await butterfly.destroy();
        return res.status(200).json({ message: "Butterfly deleted successfully"})
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
}
//POST one butterfly
const newButterfly = async(req, res) => {
    try {
        const { name, commonName, scientificName, family, region, threatLevel } = req.body;
        const butterfly = await 
        ButterflyModel.create({
            name: name,
            commonName: commonName,
            scientificName,
            family: family,
            region: region,
            threatLevel
        });
        return res.status(201).json({ message: "Butterfly created succesfully", butterfly });
    } catch (error) {
        res.status(500).json({ message:"Server error", error});
    }

}
//UPDATE one butterfly
const updateButterfly = async() => {
    
}
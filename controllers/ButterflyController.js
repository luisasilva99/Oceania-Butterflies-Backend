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
export const getOneButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByPk(id)
        
        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found"});
        }
        res.status(200).json(butterfly); // ✅ Sin envolver
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

//DELETE one butterfly
export const deleteButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const butterfly = await ButterflyModel.findByPk(id);

        if (!butterfly) {
            return res.status(404).json({ message: "Butterfly not found"});
        }
        
        await butterfly.destroy();
        return res.status(200).json({ message: "The butterfly has been deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
}

//POST one butterfly
export const createButterfly = async(req, res) => {
    try {
        const butterfly = await ButterflyModel.create(req.body);
        return res.status(201).json({ message: "Butterfly created successfully", butterfly });
    } catch (error) {
        res.status(500).json({ message:"Server error", error});
    }
}
//UPDATE one butterfly
export const updateButterfly = async(req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ButterflyModel.update(req.body, { where: { id } });

        if (updated === 0) {
            return res.status(404).json({ message: "Butterfly not found"});
        }

        const butterfly = await ButterflyModel.findByPk(id);
        return res.status(200).json(butterfly); // ✅ Sin envolver
    } catch (error) {
        console.error("ERROR en updateButterfly", error)
        res.status(500).json({ message: "Server error", error})
    }
}
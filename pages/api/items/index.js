import mongoose from "mongoose";
import Item from "../../../models/Item";

const handler = async (req, res) => {
  const { method } = req;

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  switch (method) {
    case "GET":
      try {
        const items = await Item.find({});
        res.status(200).json({ success: true, data: items });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const item = await Item.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const { id, ...updateData } = req.body;
        const item = await Item.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        if (!item) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const deletedItem = await Item.deleteOne({ _id: id });
        if (!deletedItem) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};

export default handler;

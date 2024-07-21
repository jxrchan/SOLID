const db = require("../db/db");

const seedAppointments = async (req, res) => {
  try {
    await Appointments.deleteMany({});

    await Appointments.create([
      {
        name: "Physiotherapy",
        type: "Medical",
        company: "Best Physio",
        address: "Ah Seng Road",
        date: new Date("2024-08-15T14:30:00"),
        duration: "1 hour",
        misc: "bring X-rays",
      },
      {
        name: "Meeting Ah Meng",
        type: "Social",
        company: "Cafe 77",
        address: "Katong Mall",
        date: new Date("2024-08-15T19:30:00"),
        duration: "2 hours",
        misc: "treating Ah Meng",
      },
      {
        name: "Cleaning Ahma's House",
        type: "Family",
        address: "Ahma House",
        date: new Date("2024-06-19T19:30:00"),
        duration: "2 hours",
        misc: "bring new vacuum",
      },
    ]);
    res.status(200).json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointments.find().sort({ date: 1 });
    for (const appointment of allAppointments) {
      appointment.time = appointment.date.toLocaleTimeString();
      appointment.date < Date.now()
        ? (appointment.status = "completed")
        : (appointment.status = "upcoming");
    }
    res.json(allAppointments);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error getting appointments" });
  }
};

const addAppointment = async (req, res) => {
  try {
    const newAppointment = {
      name: req.body.name,
      type: req.body.type,
      address: req.body.address,
      date: new Date(req.body.date),
    };
    if (req.body.company) {
      newAppointment.company = req.body.company;
    }
    if (req.body.duration) {
      newAppointment.duration = req.body.duration;
    }
    if (req.body.misc) {
      newAppointment.misc = req.body.misc;
    }
    await Appointments.create(newAppointment);
    res.status(200).json({ status: "ok", msg: "appointment added" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error adding appointments" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointments.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "ok", msg: "appointment deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error adding appointments" });
  }
};

const updateOneAppointment = async (req, res) => {
  try {
    const updateAppointment = {};
    if (req.body.name) {
      updateAppointment.name = req.body.name;
    }
    if (req.body.type) {
      updateAppointment.type = req.body.type;
    }
    if (req.body.address) {
      updateAppointment.address = req.body.address;
    }
    if (req.body.date) {
      updateAppointment.date = req.body.date;
    }
    if (req.body.company) {
      updateAppointment.company = req.body.company;
    }
    if (req.body.duration) {
      updateAppointment.duration = req.body.duration;
    }
    if (req.body.misc) {
      updateAppointment.misc = req.body.misc;
    }
    await Appointments.findByIdAndUpdate(req.params.id, updateAppointment);
    res.status(200).json({ status: "ok", msg: "appointment updated" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error updating appointments" });
  }
};

module.exports = {
  seedAppointments,
  getAppointments,
  addAppointment,
  deleteAppointment,
  updateOneAppointment,
};

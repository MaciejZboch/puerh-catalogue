module.exports = function checkTeaLength(req, res, tea) {
  function isProperLength(t, x) {
    return (t.length > 3 && t.length < x) || !t;
  }

  const fields = [
    { key: "name", max: 20, message: "Name must be 3 to 20 characters long!" },
    {
      key: "region",
      max: 20,
      message: "Region must be 3 to 20 characters long!",
    },
    {
      key: "village",
      max: 20,
      message: "Village must be 3 to 20 characters long!",
    },
    {
      key: "ageing_location",
      max: 20,
      message: "Ageing location must be 3 to 20 characters long!",
    },
    {
      key: "description",
      max: 200,
      message: "Description must be 3 to 200 characters long!",
    },
  ];

  for (const field of fields) {
    if (!isProperLength(tea[field.key], field.max)) {
      req.flash("error", field.message);
      return res.redirect("/tea/new");
    }
  }

  return null;
};

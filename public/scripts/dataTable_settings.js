$(document).ready(function () {
  let table = $(".teaTable").DataTable({
    columnDefs: [
      
      { orderable: false, targets: [0, 1] },
      { responsivePriority: 1, targets: 2 },
      {
        className: "dtr-control",
        targets: 0,
      },
    ],
    order: [[3, "asc"]],
    responsive: {
      details: {
        type: "column",
      },
    },
    language: {
      paginate: {
        previous: "&#8810;",
        next: "&#8811;",
      },
    },
    searching: true,
  });
  $("#table-search").keyup(function () {
    table.search($(this).val()).draw();
  });
  $("#length_change").val(table.page.len());
  $("#length_change").change(function () {
    table.page.len($(this).val()).draw();
  });
  //redirect to show page on row click
  table.on("click", "tbody tr", function () {
    const $link = $(this).find("td:eq(3) a"); // find the <a> in the 4th cell
    const href = $link.attr("href");
    if (href) {
      window.location = href;
    }
  });
});

$(document).ready(function () {
  let table = $("#myTable").DataTable({
    order: [[2, "desc"]],
    responsive: true,
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
});

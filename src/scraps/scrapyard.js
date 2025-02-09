// enum ContactStatus {
//   Active = "active",
//   Inactive = 'inactive',
//   New = 'new',
// }
var ContactStatus;
(function (ContactStatus) {
    ContactStatus[ContactStatus["Active"] = 0] = "Active";
    ContactStatus[ContactStatus["Inactive"] = 1] = "Inactive";
    ContactStatus[ContactStatus["New"] = 2] = "New";
})(ContactStatus || (ContactStatus = {}));
var primaryContact = {
    id: 123,
    name: "Grundor",
    status: ContactStatus.Active
};
console.log(primaryContact);

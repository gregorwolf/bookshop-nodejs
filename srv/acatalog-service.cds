using my.bookshop as db from '../db/data-model';

service AcatalogService @(requires:'any') {

  @readonly
  entity User {
    key username: String;
  };

  @readonly
  entity Books as projection on db.Books excluding {
    createdBy, modifiedBy
  };

  @readonly
  entity Authors as projection on db.Authors excluding {
    createdBy, modifiedBy
  };

  @requires: 'authenticated-user'
  @insertonly
  entity Orders as projection on db.Orders;
 }
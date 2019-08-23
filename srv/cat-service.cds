using my.bookshop as db from '../db/data-model';

service CatalogService @(requires:'any') {

  @readonly entity Books as projection on db.Books excluding {
    createdBy, modifiedBy
  };

  @readonly entity Authors as projection on db.Authors excluding {
    createdBy, modifiedBy
  };

  @requires: 'authenticated-user'
  @insertonly entity Orders as projection on db.Orders;
}

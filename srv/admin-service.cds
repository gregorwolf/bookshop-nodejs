using my.bookshop as db from '../db/data-model';

service AdminService 
// @(requires:'admin') 
@(requires: 'identified-user')
{
  entity Books as projection on db.Books;
  entity Authors as projection on db.Authors;
  entity Orders as select from db.Orders;
  annotate Orders with @odata.draft.enabled;

  //------- auto-exposed --------
    entity OrderItems as projection on db.OrderItems;
  //> these shall be removed but this would break the Fiori UI
  entity User {
    key username:       String;
        is_admin:       Boolean;
        is_user:        Boolean;
        is_dummy:       Boolean;
        has_admin_user:  Boolean;
        has_admin_dummy: Boolean;
        has_user_dummy:  Boolean;
  }
}

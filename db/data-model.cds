namespace my.bookshop;
using { Currency, managed, cuid } from '@sap/cds/common';

entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}
entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
}
entity OrderItems : cuid {
  parent  : Association to Orders not null;
  book   : Association to Books;
  amount : Integer;
  netAmount: Decimal(9,2);
}

entity Users {
  key username : String @( title: 'Username', );
};

entity BusinessObjects {
  key ID   : String @( title: 'Business Object', );
  parent   : Association to BusinessObjects;
  children : Composition of many BusinessObjects on children.parent = $self;
};

entity Role : cuid, managed {
      rolename    : String(255) @( title: 'Role Name', );
      description : String      @( title: 'Description', );
      BusinessObjects : Composition of many Role_BusinessObject on BusinessObjects.parent=$self;
      Users           : Composition of many Role_User on Users.parent=$self;
};

entity Role_BusinessObject : cuid, managed {
  parent : Association to Role;
  BusinessObject : Association to BusinessObjects;
};

entity Role_User : cuid, managed {
  parent : Association to Role;
  user : Association to Users;
};
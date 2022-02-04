-- \i /home/globi/aliktv/sql/vroom.sql
drop table if exists vroom;
create table vroom(
us_id varchar(20) not null,
-- nick varchar(16) unique not null references buser(bname),
-- src text, -- video src
poster text, -- video poster
descr text, -- video stream description
crat TIMESTAMP  NOT NULL default now()::timestamp, -- created at
typ varchar(6) not null default 'all', -- all = broadcast , priv = privat
v int not null default 0 -- how much users views the stream
); 
				-- grant all privileges on table vroom to globi;
-- insert into vroom(us_id, nick, p, descr, typ) values(2,'mickey','mickey.jpg','I kill my pussy','all');

-- alter table vroom add column descr text;

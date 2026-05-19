-- Prisma Migrate uses a temporary "shadow database" during `migrate dev` to
-- detect drift. That requires CREATE/DROP/ALTER on *.* — by default the
-- MYSQL_USER only has privileges on its own MYSQL_DATABASE. Grant the rest
-- here so `prisma migrate dev` works against this dev MySQL out of the box.
GRANT ALL PRIVILEGES ON *.* TO 'emmapay'@'%';
FLUSH PRIVILEGES;

-- Create Equipment tabe
CREATE TABLE `dclm_store`.`equipment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `manufacturer` VARCHAR(45) NULL,
  `product_class` VARCHAR(45) NULL,
  `function_` VARCHAR(45) NULL,
  `product` VARCHAR(45) NULL,
  `store_item` VARCHAR(45) NULL,
  `purchase` VARCHAR(45) NULL,
  `vendor` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

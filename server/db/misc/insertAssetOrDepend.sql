INSERT INTO appassets_table (application, asset_name)
VALUES
  (1, 'USMAPSQLPRD01'),
  (1, 'USMAPSQLPRD02'),
  (1, 'USMAPWEBPRD01'),
  (1, 'USMAPWEBPRD02'),
  (1, 'USMAPAPPPRD01'),
  (1, 'USMAPAPPPRD02'),
  (1, 'USMAPAPPPRD03'),
  (1, 'USMAPAPPPRD04'),
  (1, 'USMAPFSPRD01'),
  (2, 'EUMAPSQLPRD01'),
  (2, 'EUMAPSQLPRD02'),
  (2, 'EUMAPWEBPRD01'),
  (2, 'EUMAPWEBPRD02'),
  (2, 'EUMAPAPPPRD01'),
  (2, 'EUMAPAPPPRD02'),
  (2, 'EUMAPAPPPRD03'),
  (2, 'EUMAPAPPPRD04'),
  (2, 'EUMAPFSPRD01'),
  (3, 'USMAPSQLDEV01'),
  (3, 'USMAPSQLDEV02'),
  (3, 'USMAPWEBDEV01'),
  (3, 'USMAPWEBDEV02'),
  (3, 'USMAPAPPDEV01'),
  (3, 'USMAPAPPDEV02'),
  (3, 'USMAPAPPDEV03'),
  (3, 'USMAPAPPDEV04'),
  (3, 'USMAPFSDEV01'),
  (4, 'USEliteSyncSQLPRD01'),
  (4, 'USEliteSyncSQLPRD02'),
  (4, 'USEliteSyncWEBPRD01'),
  (4, 'USEliteSyncWEBPRD02'),
  (4, 'USEliteSyncAPPPRD01'),
  (4, 'USEliteSyncAPPPRD02'),
  (4, 'USEliteSyncAPPPRD03'),
  (4, 'USEliteSyncAPPPRD04'),
  (4, 'USEliteSyncFSPRD01'),
  (5, 'USePaySQLPRD01'),
  (5, 'USePaySQLPRD02'),
  (5, 'USePayWEBPRD01'),
  (5, 'USePayWEBPRD02'),
  (5, 'USePayAPPPRD01'),
  (5, 'USePayAPPPRD02'),
  (5, 'USePayAPPPRD03'),
  (5, 'USePayAPPPRD04'),
  (5, 'USePayFSPRD01'),
  (6, 'USAppProSQLPRD01'),
  (6, 'USAppProSQLPRD02'),
  (6, 'USAppProWEBPRD01'),
  (6, 'USAppProWEBPRD02'),
  (6, 'USAppProAPPPRD01'),
  (6, 'USAppProAPPPRD02'),
  (6, 'USAppProAPPPRD03'),
  (6, 'USAppProAPPPRD04'),
  (6, 'USAppProFSPRD01');






INSERT INTO appdependencies_table (application, dependency_name)
VALUES
  (1, 'AppPro_Production_NewYork'),
  (1, 'EliteSync_Production_NewYork'),
  (4, 'ePay_Production_NewYork'),
  (4, 'MAP_Production_NewYork'),
  (4, 'AppPro_Production_NewYork'),
  (5, 'EliteSync_Production_NewYork'),
  (6, 'MAP_Production_NewYork'),
  (6, 'EliteSync_Production_NewYork');




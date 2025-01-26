const deskStructure = (S: any) => 
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Services')
        .child(
          S.documentList()
            .title('Services')
            .filter('_type == "services"')
        ),
      S.listItem()
        .title('Service Providers')
        .child(
          S.documentList()
            .title('Service Providers')
            .filter('_type == "serviceProvider"')
        ),
      // Add other list items as needed
    ]);

export default deskStructure; 
# API Integration and Data Migration Report

## API Integration Process
For this project, I integrated two APIs directly on the landing page to dynamically display product data:

1. **FakeStore API**  
   URL: [https://fakestoreapi.com/products](https://fakestoreapi.com/products)  
   - This API provided product details, including images, titles, and descriptions.

2. **Hackathon Template API**  
   URL: [https://hackathon-apis.vercel.app/api/products](https://hackathon-apis.vercel.app/api/products)  
   - This API was used as an additional source for diverse product options.

## Adjustments Made to Schemas
- Since the project required custom data, I only utilized the `image` and `title` fields from the provided APIs.
- The remaining dataset was rewritten manually to match the specific requirements of the project.
- Custom schema adjustments were made to align with the application’s design and functionality.

## Day 3 - API Integration and Data Migration
### Data Migration to Sanity Studio
- I used a **custom script** to parse and migrate the JSON data into Sanity Studio.  
  - The script transformed API responses into a format compatible with my custom schema.
  - Additional fields were added to enrich the data for project-specific needs.

### Tools Used
1. **Postman Desktop Agent**  
   - Tested API endpoints and inspected the responses to ensure accurate data retrieval.

2. **Online JSON Formatter**  
   - Cleaned and formatted the raw JSON responses for better readability and debugging.

By leveraging these tools and workflows, I successfully integrated the APIs and migrated the necessary data into Sanity Studio, ensuring a tailored and dynamic content system for the project.

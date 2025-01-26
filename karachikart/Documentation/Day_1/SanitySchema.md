# Data Schema

## Products (Common to both second-hand and brand-new):

productId: String (Unique ID)
name: String
price: Number
stock: Number
sellerId: Reference to Seller
description: Text
condition: Enum (New/Second-Hand)
category: Reference to Category
tags: Array of Strings

## Services:

serviceId: String (Unique ID)
title: String
description: Text
price: Number
serviceProviderId: Reference to Service Provider
availability: Boolean
tags: Array of Strings
portfolio: Array of Files/Images (Uploaded and referenced via Sanity CMS)
deliveryTimeEstimate: Number (Days/Hours)

## Orders:

orderId: String (Unique ID)
customerId: Reference to Customer
items: Array of Product/Service References
totalAmount: Number
status: Enum (Pending, Processed, Shipped, Delivered, Canceled)
paymentMethod: String
deliveryMethod: String
timestamp: DateTime

## Sellers:

sellerId: String (Unique ID)
name: String
contactInfo: Object { email: String, phone: String }
products: Array of Product References
reviews: Array of Review References
earnings: Number
joinedDate: DateTime

## **Service Providers:**

serviceProviderId: String (Unique ID)
name: String
contactInfo: Object { email: String, phone: String }
servicesOffered: Array of Service References
portfolio: Array of Files/Images (Managed via Sanity Assets)
reviews: Array of Review References
earnings: Number
joinedDate: DateTime

## Customers:

customerId: String (Unique ID)
name: String
contactInfo: Object { email: String, phone: String }
address: Object { street: String, city: String, state: String, postalCode: String }
orderHistory: Array of Order References
wishlist: Array of Product References
joinedDate: DateTime

## Categories (For filtering and organization):

categoryId: String (Unique ID)
name: String (e.g., Electronics, Fashion, Services)
subcategories: Array of Strings
tags: Array of Strings

## Reviews and Ratings:

reviewId: String (Unique ID)
productOrServiceId: Reference to Product or Service
userId: Reference to Customer or Seller
rating: Number (1–5)
comment: Text
timestamp: DateTime

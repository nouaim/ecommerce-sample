This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Steps to run 

First, install the project:

```bash
npm install
```

Second, run the development server:


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Tech

- Sakai is an open source template free in primeReact which provides nice resources suitable for basic eccomerce project like this.
- Sakai is based on Next Js which is a nice choice for this project.
- Sweet alerts 2 are nice alerts that can improve the UX.

# notes

- when the creattion of the product happends it will redirect to the page with the id of the new product. It will be 404 because the FakeStoreApi doesn't provide the ability to store new data as stated in its docs 

> "Note: Posted data will not really insert into the database and just return a fake id." source: https://github.com/keikaavousi/fake-store-api?tab=readme-ov-file#add-new-product

- Sakaicnow (at this current Date) for primeng and in primevue has a better technology than the one used in primereact. (design token: https://primeng.org/theming). It should be available in the next version of primereact (11).



## features

### list of the products

#### Grid view

![List](./screenshots/grid-view.png)

#### List View

![List](./screenshots/list-view.png)

### add new product

- we must add a valid link in the image url field in order to work

![Add New Product](./screenshots/add-new-product.png)


### edit product

click on any of the products in the products page. You will be able to edit the page if you have the permission to do so.


![Edit Product](./screenshots/edit-product.png)

![Fields](./screenshots/edit-product-fields.png)


### delete product



![Delete a product](./screenshots/delete-product.png)

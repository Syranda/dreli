import { PrismaClient, Product } from '@prisma/client'
import { dropin, BraintreeGateway, Environment } from 'braintree'
import { GetServerSideProps } from 'next'
import React from 'react'

type HomeProps = {
  products: Product[],
  token: string
}

export default function Home({ products, token }: HomeProps) {

  const createDropin = () => {
    dropin.create({
      authorization: token,
      container: '#dropin-container'
    })
  }

  return (
    <div>
      {
        products.map((product, index) => {
          return (
            <article key={index}>
              { product.name} <br />
              { product.description ?? 'No description provided'} <br />
              Price: { product.price.toFixed(2)} € <br />
              <button onClick={createDropin}>Buy</button>
            </article>
          )
        })
      }
      <div id="dropin-container"></div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const gateway = new BraintreeGateway({
    environment: Environment.Sandbox,
    merchantId: 'bgmnh5gwwktc33p3',
    publicKey: 'wdzdcgrwmfwbwzpk',
    privateKey: '76c26fdb75723219d4d37a15560434c1'
  })


  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();
  const token = await gateway.clientToken.generate({});

  return {
    props: {
      products,
      token: token.clientToken
    }
  }
}

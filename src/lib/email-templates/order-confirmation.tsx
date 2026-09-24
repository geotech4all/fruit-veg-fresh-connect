import React from 'react'
import { Body, Container, Head, Html, Preview, Section, Text, Hr } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './styles'

type Item = { name: string; label: string; quantity: number; total: number }
interface Props {
  name?: string
  orderNumber?: string
  items?: Item[]
  subtotal?: number
  discount?: number
  total?: number
  address?: string
  consultation?: boolean
}

const Email = ({ name, orderNumber, items = [], subtotal, discount = 0, total, address, consultation }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Fruit&Veg order {orderNumber ?? ''} is confirmed</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.brand}><span style={s.green}>Fruit</span><span style={s.orange}>&amp;</span><span style={s.green}>Veg</span></Text>
        <Text style={s.h1}>Thank you{name ? `, ${name}` : ''}!</Text>
        <Text style={s.text}>We've received your order <strong>{orderNumber}</strong>. Our team will call you shortly to confirm delivery. You pay on delivery.</Text>
        <Section style={s.box}>
          {items.map((i, k) => (
            <Text key={k} style={s.row}>{i.quantity} × {i.name} ({i.label}) — {s.naira(i.total)}</Text>
          ))}
          <Hr />
          <Text style={s.row}>Subtotal: {s.naira(subtotal)}</Text>
          {discount > 0 && <Text style={s.row}>Discount: −{s.naira(discount)}</Text>}
          <Text style={{ ...s.row, fontWeight: 700 }}>Total: {s.naira(total)}</Text>
        </Section>
        {address && <Text style={s.text}><strong>Delivery to:</strong> {address}</Text>}
        <Text style={s.text}>✅ Free delivery · ✅ Payment on delivery · ✅ 100% money-back guarantee{consultation ? ' · ✅ Free 30-second health consultation' : ''}</Text>
        <Text style={s.small}>Questions? Reply to this email or write to fruitvegfarm@gmail.com.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Order ${d.orderNumber ?? ''} confirmed — Fruit&Veg`,
  displayName: 'Order confirmation (customer)',
  previewData: {
    name: 'Ada', orderNumber: 'FV-A1B2C3',
    items: [{ name: 'Teleios Ofada Rice', label: '10kg', quantity: 2, total: 90000 }],
    subtotal: 90000, discount: 5000, total: 85000, address: '12 Allen Ave, Ikeja, Lagos',
  },
} satisfies TemplateEntry

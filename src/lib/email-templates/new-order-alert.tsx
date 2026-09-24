import React from 'react'
import { Body, Container, Head, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './styles'

type Item = { name: string; label: string; quantity: number; total: number }
interface Props {
  orderNumber?: string
  name?: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  items?: Item[]
  total?: number
}

const Email = ({ orderNumber, name, phone, email, address, notes, items = [], total }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New order {orderNumber ?? ''} — {s.naira(total)}</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.h1}>New order {orderNumber}</Text>
        <Section style={s.box}>
          <Text style={s.row}><strong>Customer:</strong> {name}</Text>
          <Text style={s.row}><strong>Phone:</strong> {phone}</Text>
          {email && <Text style={s.row}><strong>Email:</strong> {email}</Text>}
          <Text style={s.row}><strong>Address:</strong> {address}</Text>
          {notes && <Text style={s.row}><strong>Notes:</strong> {notes}</Text>}
        </Section>
        <Section style={s.box}>
          {items.map((i, k) => (
            <Text key={k} style={s.row}>{i.quantity} × {i.name} ({i.label}) — {s.naira(i.total)}</Text>
          ))}
          <Text style={{ ...s.row, fontWeight: 700 }}>Total: {s.naira(total)}</Text>
        </Section>
        <Text style={s.small}>Open the team dashboard to update this order.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New order ${d.orderNumber ?? ''} — ${s.naira(d.total)}`,
  displayName: 'New order alert (team)',
  to: 'fruitvegfarm@gmail.com',
  previewData: {
    orderNumber: 'FV-A1B2C3', name: 'Ada Obi', phone: '08012345678', address: '12 Allen Ave, Ikeja, Lagos',
    items: [{ name: 'Normal Rice', label: '50kg', quantity: 1, total: 70000 }], total: 65000,
  },
} satisfies TemplateEntry

import React from 'react'
import { Body, Button, Container, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import * as s from './styles'

interface Props { name?: string }

const Email = ({ name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Fruit&Veg membership</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.brand}><span style={s.green}>Fruit</span><span style={s.orange}>&amp;</span><span style={s.green}>Veg</span></Text>
        <Text style={s.h1}>Welcome{name ? `, ${name}` : ''}!</Text>
        <Text style={s.text}>Thanks for joining Fruit&amp;Veg membership. You're now on our list for member discounts and updates when fresh produce becomes available.</Text>
        <Button href="https://fruitvegfarm.com/shop" style={s.button}>Browse the shop</Button>
        <Text style={{ ...s.small, marginTop: '20px' }}>Fruit&amp;Veg · Head Office: Lagos · Farm: Araromi-Owu, Ikire Apomu, Osun State</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Welcome to Fruit&Veg membership',
  displayName: 'Membership welcome',
  previewData: { name: 'Ada' },
} satisfies TemplateEntry

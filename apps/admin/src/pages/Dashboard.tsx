import type React from 'react';
import PackageIcon from 'lucide-react/dist/esm/icons/package';
import ShoppingCartIcon from 'lucide-react/dist/esm/icons/shopping-cart';
import UsersIcon from 'lucide-react/dist/esm/icons/users';
import TrendingUpIcon from 'lucide-react/dist/esm/icons/trending-up';
import DollarSignIcon from 'lucide-react/dist/esm/icons/dollar-sign';
import AlertTriangleIcon from 'lucide-react/dist/esm/icons/alert-triangle';
import { cn } from '@/lib/utils';
import { Card } from '@happy-baby/shared-ui';
import { SessionInfo } from '@happy-baby/feature-auth';

const STATS = [
  {
    label: 'Total Productos',
    value: '124',
    change: '+8 este mes',
    positive: true,
    icon: PackageIcon,
    color: '#A285D1',
  },
  {
    label: 'Pedidos Activos',
    value: '23',
    change: '+5 hoy',
    positive: true,
    icon: ShoppingCartIcon,
    color: '#FF7B5A',
  },
  {
    label: 'Clientes',
    value: '1,247',
    change: '+12% este mes',
    positive: true,
    icon: UsersIcon,
    color: '#5CBDB4',
  },
  {
    label: 'Ingresos',
    value: '$4,832',
    change: '+15% este mes',
    positive: true,
    icon: DollarSignIcon,
    color: '#5CBDB4',
  },
] as const;

const RECENT_ORDERS = [
  {
    id: '#001',
    customer: 'María García',
    amount: '$89.99',
    status: 'Pendiente',
  },
  {
    id: '#002',
    customer: 'Ana López',
    amount: '$124.50',
    status: 'Procesando',
  },
  { id: '#003', customer: 'Carmen Silva', amount: '$67.20', status: 'Enviado' },
  {
    id: '#004',
    customer: 'Sofia Ruiz',
    amount: '$156.80',
    status: 'Entregado',
  },
];

const RECENT_PRODUCTS = [
  { name: 'Body Algodón Orgánico', sku: 'BO-001', stock: 45 },
  { name: 'Pijama Dreams Rosa', sku: 'PD-002', stock: 23 },
  { name: 'Conjunto Suave Azul', sku: 'CS-003', stock: 67 },
];

const QUICK_ACTIONS = [
  {
    title: 'Agregar Producto',
    description: 'Crear un nuevo producto',
    icon: PackageIcon,
  },
  {
    title: 'Ver Pedidos',
    description: 'Gestionar pedidos activos',
    icon: ShoppingCartIcon,
  },
  {
    title: 'Estadísticas',
    description: 'Ver análisis detallado',
    icon: TrendingUpIcon,
  },
  {
    title: 'Stock Bajo',
    description: 'Revisar inventario',
    icon: AlertTriangleIcon,
  },
];

export const Dashboard: React.FC = () => (
  <div className='flex flex-col gap-6'>
    {/* Header */}
    <div className='mb-2'>
      <h1 className='m-0 mb-2 font-heading text-4xl font-light text-foreground'>
        Dashboard
      </h1>
      <p className='m-0 text-lg text-muted-foreground'>
        Resumen general de Happy Baby Style
      </p>
    </div>

    {/* Stats Grid */}
    <div className='mb-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]'>
      {STATS.map(stat => (
        <Card key={stat.label} className='cursor-default'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col'>
              <div className='text-3xl font-medium leading-[1.2] text-foreground'>
                {stat.value}
              </div>
              <div className='mt-1 text-sm text-muted-foreground'>
                {stat.label}
              </div>
              <div
                className={cn(
                  'mt-1 text-xs font-medium',
                  stat.positive ? 'text-green-600' : 'text-yellow-600'
                )}
              >
                {stat.change}
              </div>
            </div>
            <div
              className='flex h-[60px] w-[60px] items-center justify-center rounded-xl'
              style={{ background: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Content Grid */}
    <div className='grid gap-6 max-lg:grid-cols-1 lg:grid-cols-[2fr_1fr]'>
      {/* Recent Activity */}
      <div className='flex flex-col gap-4'>
        <h2 className='m-0 font-heading text-2xl font-light text-foreground'>
          Actividad Reciente
        </h2>

        <Card>
          <Card.Header>
            <Card.Title>Pedidos Recientes</Card.Title>
          </Card.Header>
          <div className='flex flex-col gap-3'>
            {RECENT_ORDERS.map(order => (
              <div
                key={order.id}
                className='flex items-center justify-between rounded-lg border border-border bg-white p-4 transition-all hover:border-brand-purple/25 hover:shadow-sm'
              >
                <div className='flex flex-col'>
                  <div className='mb-1 font-medium text-foreground'>
                    {order.id} - {order.customer}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {order.status}
                  </div>
                </div>
                <div className='font-medium text-brand-purple'>
                  {order.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Productos Recientes</Card.Title>
          </Card.Header>
          <div className='flex flex-col gap-3'>
            {RECENT_PRODUCTS.map(product => (
              <div
                key={product.sku}
                className='flex items-center justify-between rounded-lg border border-border bg-white p-4 transition-all hover:border-brand-purple/25 hover:shadow-sm'
              >
                <div className='flex flex-col'>
                  <div className='mb-1 font-medium text-foreground'>
                    {product.name}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    SKU: {product.sku}
                  </div>
                </div>
                <div className='font-medium text-brand-purple'>
                  Stock: {product.stock}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='flex flex-col gap-4'>
        <h2 className='m-0 font-heading text-2xl font-light text-foreground'>
          Acciones Rápidas
        </h2>

        <Card>
          <div className='flex flex-col gap-0'>
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.title}
                className='flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:bg-brand-purple/10'
              >
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-purple text-white'>
                  <action.icon size={20} />
                </div>
                <div className='flex flex-col'>
                  <div className='mb-1 font-medium text-foreground'>
                    {action.title}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <SessionInfo />
      </div>
    </div>
  </div>
);

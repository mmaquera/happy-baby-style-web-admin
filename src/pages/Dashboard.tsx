import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Card } from '@/components/ui/Card';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { SessionInfo } from '@/components/auth/SessionInfo';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing[2]};
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['4xl']};
  font-weight: ${theme.fontWeights.light};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatCard = styled(Card)`
  cursor: default;
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: ${theme.fontSizes.xs};
  color: ${({ positive }) => positive ? theme.colors.success : theme.colors.warning};
  margin-top: ${theme.spacing[1]};
  font-weight: ${theme.fontWeights.medium};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.lg};
  background: ${({ color }) => `${color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RecentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.light};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.base};

  &:hover {
    border-color: ${theme.colors.primaryPurple}40;
    box-shadow: ${theme.shadows.sm};
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const ItemSubtitle = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const ItemValue = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.primaryPurple};
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.base};
  text-align: left;
  width: 100%;

  &:hover {
    border-color: ${theme.colors.primaryPurple};
    background: ${theme.colors.softPurple};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primaryPurple};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
`;

const ActionText = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionTitle = styled.div`
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const ActionDescription = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

export const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Productos',
      value: '124',
      change: '+8 este mes',
      positive: true,
      icon: Package,
      color: theme.colors.primaryPurple
    },
    {
      label: 'Pedidos Activos',
      value: '23',
      change: '+5 hoy',
      positive: true,
      icon: ShoppingCart,
      color: theme.colors.coralAccent
    },
    {
      label: 'Clientes',
      value: '1,247',
      change: '+12% este mes',
      positive: true,
      icon: Users,
      color: theme.colors.turquoise
    },
    {
      label: 'Ingresos',
      value: '$4,832',
      change: '+15% este mes',
      positive: true,
      icon: DollarSign,
      color: theme.colors.success
    }
  ];

  const recentOrders = [
    { id: '#001', customer: 'María García', amount: '$89.99', status: 'Pendiente' },
    { id: '#002', customer: 'Ana López', amount: '$124.50', status: 'Procesando' },
    { id: '#003', customer: 'Carmen Silva', amount: '$67.20', status: 'Enviado' },
    { id: '#004', customer: 'Sofia Ruiz', amount: '$156.80', status: 'Entregado' },
  ];

  const recentProducts = [
    { name: 'Body Algodón Orgánico', sku: 'BO-001', stock: 45 },
    { name: 'Pijama Dreams Rosa', sku: 'PD-002', stock: 23 },
    { name: 'Conjunto Suave Azul', sku: 'CS-003', stock: 67 },
  ];

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Resumen general de Happy Baby Style</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} padding="medium" shadow="small" hover>
            <StatContent>
              <StatInfo>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
                <StatChange positive={stat.positive}>{stat.change}</StatChange>
              </StatInfo>
              <StatIcon color={stat.color}>
                <stat.icon size={24} />
              </StatIcon>
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <RecentSection>
          <SectionTitle>Actividad Reciente</SectionTitle>
          
          <Card padding="medium" shadow="small">
            <Card.Header>
              <Card.Title>Pedidos Recientes</Card.Title>
            </Card.Header>
            <RecentList>
              {recentOrders.map((order) => (
                <RecentItem key={order.id}>
                  <ItemInfo>
                    <ItemTitle>{order.id} - {order.customer}</ItemTitle>
                    <ItemSubtitle>{order.status}</ItemSubtitle>
                  </ItemInfo>
                  <ItemValue>{order.amount}</ItemValue>
                </RecentItem>
              ))}
            </RecentList>
          </Card>

          <Card padding="medium" shadow="small">
            <Card.Header>
              <Card.Title>Productos Recientes</Card.Title>
            </Card.Header>
            <RecentList>
              {recentProducts.map((product) => (
                <RecentItem key={product.sku}>
                  <ItemInfo>
                    <ItemTitle>{product.name}</ItemTitle>
                    <ItemSubtitle>SKU: {product.sku}</ItemSubtitle>
                  </ItemInfo>
                  <ItemValue>Stock: {product.stock}</ItemValue>
                </RecentItem>
              ))}
            </RecentList>
          </Card>
        </RecentSection>

        <QuickActions>
          <SectionTitle>Acciones Rápidas</SectionTitle>
          
          <Card padding="medium" shadow="small">
            <ActionButton>
              <ActionIcon>
                <Package size={20} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Agregar Producto</ActionTitle>
                <ActionDescription>Crear un nuevo producto</ActionDescription>
              </ActionText>
            </ActionButton>

            <ActionButton>
              <ActionIcon>
                <ShoppingCart size={20} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Ver Pedidos</ActionTitle>
                <ActionDescription>Gestionar pedidos activos</ActionDescription>
              </ActionText>
            </ActionButton>

            <ActionButton>
              <ActionIcon>
                <TrendingUp size={20} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Estadísticas</ActionTitle>
                <ActionDescription>Ver análisis detallado</ActionDescription>
              </ActionText>
            </ActionButton>

            <ActionButton>
              <ActionIcon>
                <AlertTriangle size={20} />
              </ActionIcon>
              <ActionText>
                <ActionTitle>Stock Bajo</ActionTitle>
                <ActionDescription>Revisar inventario</ActionDescription>
              </ActionText>
            </ActionButton>
          </Card>

          {/* Session Info */}
          <SessionInfo />
        </QuickActions>
      </ContentGrid>
    </DashboardContainer>
  );
};
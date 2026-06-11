import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Sidebar } from '../Sidebar';

function renderSidebar(role: 'admin' | 'manager' | 'accountant' | 'viewer') {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Sidebar role={role} />
    </MemoryRouter>,
  );
}

describe('Sidebar role visibility', () => {
  it('shows only readonly-safe navigation for a viewer', () => {
    renderSidebar('viewer');

    expect(screen.getByText('Панель керування')).toBeInTheDocument();
    expect(screen.getByText('Товари')).toBeInTheDocument();
    expect(screen.getByText('Категорії')).toBeInTheDocument();
    expect(screen.getByText('Покупці')).toBeInTheDocument();
    expect(screen.getByText('Угоди')).toBeInTheDocument();
    expect(screen.getByText('Профіль')).toBeInTheDocument();
    expect(screen.queryByText('Платежі')).not.toBeInTheDocument();
    expect(screen.queryByText('Знижки')).not.toBeInTheDocument();
    expect(screen.queryByText('Звіти')).not.toBeInTheDocument();
    expect(screen.queryByText('Складські операції')).not.toBeInTheDocument();
  });

  it('shows accountant financial pages but hides operational admin pages', () => {
    renderSidebar('accountant');

    expect(screen.getByText('Платежі')).toBeInTheDocument();
    expect(screen.getByText('Звіти')).toBeInTheDocument();
    expect(screen.queryByText('Знижки')).not.toBeInTheDocument();
    expect(screen.queryByText('Складські операції')).not.toBeInTheDocument();
  });

  it('shows full restricted navigation for an admin', () => {
    renderSidebar('admin');

    expect(screen.getByText('Знижки')).toBeInTheDocument();
    expect(screen.getAllByText('Платежі').length).toBeGreaterThan(0);
    expect(screen.getByText('Звіти')).toBeInTheDocument();
    expect(screen.getByText('Складські операції')).toBeInTheDocument();
  });
});

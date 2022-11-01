import { screen } from '@testing-library/react';

/**
 * Test Ids
 */

export const TestIds = {
  Trigger: 'test/select-trigger',
  List: 'test/select-list',
};

/**
 * Get Element
 */

export const getTriggerButton = () => {
  return screen.getByTestId(TestIds.Trigger);
};

export const querySelectList = () => {
  return screen.queryByTestId(TestIds.List);
};

export const queryAllOption = () => {
  return screen.queryAllByRole('option');
};

export const getSpecificOption = ({ optionIndex }: { optionIndex: number }) => {
  return queryAllOption()[optionIndex];
};

/**
 * Check Specific Status
 */

export const checkSelectList = ({ shouldExist }: { shouldExist: boolean }) => {
  const selectList = querySelectList();

  if (shouldExist) {
    expect(selectList).toBeInTheDocument();
    return;
  }

  expect(selectList).not.toBeInTheDocument();
};

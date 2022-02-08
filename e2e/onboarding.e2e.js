describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions: { notifications: 'YES' } });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Presentation', async () => {
    await expect(element(by.id('screen-0'))).toBeVisible();

    await expect(element(by.id('scroll-view'))).toBeVisible();

    await element(by.id('scroll-view')).swipe('left', 'fast');
    await expect(element(by.id('screen-1'))).toBeVisible();
    await element(by.id('scroll-view')).swipe('left', 'fast');
    await expect(element(by.id('screen-2'))).toBeVisible();
    await element(by.id('scroll-view')).swipe('left', 'fast');
    await expect(element(by.id('screen-3'))).toBeVisible();

    await element(by.id('scroll-view')).swipe('right', 'fast');
    await expect(element(by.id('screen-2'))).toBeVisible();
    await element(by.id('scroll-view')).swipe('right', 'fast');
    await expect(element(by.id('screen-1'))).toBeVisible();

    await element(by.id('next-button')).tap();
    await expect(element(by.id('screen-2'))).toBeVisible();
    await element(by.id('next-button')).tap();
    await expect(element(by.id('screen-3'))).toBeVisible();

    try { // check button disabled
      await element(by.id('start-button')).tap();
      await expect(element(by.id('__unknown'))).toBeVisible();
    } catch(e) {}

    await element(by.id('check-box')).tap();

    await element(by.id('start-button')).tap();
  });

  it('Supported', async () => {
    await element(by.id('not-followed-button')).tap();
  });

  it('Symptoms', async () => {
    await element(by.id('scroll-view')).scrollTo('bottom');

    try { // check button disabled
      await element(by.id('validate-button')).tap();
      await expect(element(by.id('__unknown'))).toBeVisible();
    } catch(e) {}

    await element(by.id('scroll-view')).scrollTo('top');

    await element(by.id('check-box-mood')).tap();
    await element(by.id('check-box-anxiety')).tap();

    await element(by.id('custom-input')).typeText('Custom');
    await element(by.id('custom-add-button')).tap();
    await expect(element(by.text('Custom'))).toBeVisible();

    await element(by.id('scroll-view')).scrollTo('bottom');

    await element(by.id('validate-button')).tap();
  });

  it('Drugs', async () => {
    await element(by.id('add-drugs-button')).tap();

    await waitFor(element(by.text('Champix'))).toBeVisible().whileElement(by.id('scroll-view')).scroll(300, 'down', 0.5, 0.7);

    await element(by.id('check-box-champix')).tap();

    await waitFor(element(by.text('Deroxat'))).toBeVisible().whileElement(by.id('scroll-view')).scroll(300, 'down', 0.5, 0.7);

    await element(by.id('check-box-deroxat')).tap();

    await element(by.id('validate-button')).tap();

    await expect(element(by.id('drug-item-deroxat'))).toBeVisible();
    await expect(element(by.id('drug-item-champix'))).toBeVisible();

    await element(by.id('continue-button')).tap();
  });

  it('Reminder', async () => {
    await element(by.id('later-button')).tap();
  });

  it('Final check', async () => {
    await element(by.id('main-button')).tap();
    await element(by.id('day-button-0')).tap();
    await expect(element(by.text('Humeur'))).toBeVisible();
    await expect(element(by.text('Anxiété'))).toBeVisible();
    await expect(element(by.text('Custom'))).toBeVisible();
  });
});

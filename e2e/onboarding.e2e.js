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

    /*try { // check button disabled
      await element(by.id('validate-button')).tap();
      await expect(element(by.id('__unknown'))).toBeVisible();
    } catch(e) {}*/

    await element(by.id('scroll-view')).scrollTo('top');

    /*await element(by.id('check-box-mood')).tap();
    await element(by.id('check-box-anxiety')).tap();*/

    await element(by.id('scroll-view')).scrollTo('bottom');

    //await element(by.id('validate-button')).tap();
  });
});

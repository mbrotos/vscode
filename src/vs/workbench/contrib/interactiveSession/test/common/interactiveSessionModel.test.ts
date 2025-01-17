/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { timeout } from 'vs/base/common/async';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { TestInstantiationService } from 'vs/platform/instantiation/test/common/instantiationServiceMock';
import { ILogService, NullLogService } from 'vs/platform/log/common/log';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { InteractiveSessionModel } from 'vs/workbench/contrib/interactiveSession/common/interactiveSessionModel';
import { IExtensionService } from 'vs/workbench/services/extensions/common/extensions';
import { TestExtensionService, TestStorageService } from 'vs/workbench/test/common/workbenchTestServices';

suite('InteractiveSessionModel', () => {
	const testDisposables = new DisposableStore();

	let instantiationService: TestInstantiationService;

	suiteSetup(async () => {
		instantiationService = new TestInstantiationService();
		instantiationService.stub(IStorageService, new TestStorageService());
		instantiationService.stub(ILogService, new NullLogService());
		instantiationService.stub(IExtensionService, new TestExtensionService());
	});

	teardown(() => {
		testDisposables.clear();
	});

	test('Waits for initialization', async () => {
		const model = new InteractiveSessionModel('provider', undefined, new NullLogService());

		let hasInitialized = false;
		model.waitForInitialization().then(() => {
			hasInitialized = true;
		});

		await timeout(0);
		assert.strictEqual(hasInitialized, false);

		model.initialize(null!, undefined);
		await timeout(0);
		assert.strictEqual(hasInitialized, true);
	});

	test('Initialization fails when model is disposed', async () => {
		const model = new InteractiveSessionModel('provider', undefined, new NullLogService());
		model.dispose();

		await assert.rejects(() => model.waitForInitialization());
	});
});


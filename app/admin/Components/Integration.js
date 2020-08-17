/**
 * Admin integration page component.
 *
 * @package email-capture-lead-generation
 * @since 1.0.2
 */

import { useState, useEffect } from '@wordpress/element'
import { Panel, PanelBody, PanelRow, ToggleControl, TextControl, Spinner, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const providerOptions = () => {
    return [
        { label: __('Select One', 'email-capture-lead-generation'), value: null },
        { label: 'MailChimp', value: 'mailchimp' },
        { label: 'MailerLite', value: 'mailerlite' }
    ];
}

const Integration = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [integrationData, setIntegrationData] = useState({});

    useEffect(function () {
        setIntegrationData(
            {
                useOwnList: 'yes',
                selectedProvider: null,
            }
        );
        setIsLoading(false);
    }, []);

    const { useOwnList, selectedProvider } = integrationData;

    return (

        <Panel header={__('Integration and Newsletters', 'email-capture-lead-generation')}>

            {
                isLoading ?

                    <Spinner />

                    :

                    <>
                        <PanelBody title={__('Listing Provider', 'email-capture-lead-generation')}>

                            <PanelRow>
                                <label>{__('Use default own list', 'email-capture-lead-generation')}</label>
                                <div className="email-capture-lead-generation-field-wrapper">
                                    <ToggleControl
                                        checked={useOwnList == 'yes'}
                                        onChange={
                                            () => {
                                                let isChecked = useOwnList == 'yes' ? 'no' : 'yes';
                                                setIntegrationData({
                                                    ...integrationData,
                                                    useOwnList: isChecked
                                                });
                                            }
                                        }
                                    />
                                </div>
                            </PanelRow>
                            {
                                useOwnList == 'no' &&
                                <PanelRow>
                                    <label>{__('Select your provider', 'email-capture-lead-generation')}</label>
                                    <div className="email-capture-lead-generation-field-wrapper">
                                        <SelectControl
                                            options={providerOptions()}
                                            value={selectedProvider ? selectedProvider : ''}
                                            onChange={
                                                (value) => {
                                                    setIntegrationData({
                                                        ...integrationData,
                                                        selectedProvider: value
                                                    });
                                                }
                                            }
                                        />
                                    </div>
                                </PanelRow>

                            }

                        </PanelBody>


                        <ProviderConfigs options={providerOptions()} integrationData={integrationData} />
                    </>
            }

        </Panel>

    );
}



const ProviderConfigs = ({ options, integrationData }) => {
    const { useOwnList, selectedProvider } = integrationData;

    if (useOwnList !== 'no') {
        return null;
    }


    let providerLabel = '';

    if (null !== selectedProvider && 'undefined' !== typeof options) {
        options.filter(function (option) {
            if (option.value == selectedProvider) {
                providerLabel = option.label;
            }
        });
    }

    if (!providerLabel) {
        return null;
    }

    console.log(providerLabel);

    let panelBodyTitle = providerLabel + ' ' + __('configurations', 'email-capture-lead-generation');

    return (
        <PanelBody title={panelBodyTitle}>

            <PanelRow>
                <label>{__('API Key', 'email-capture-lead-generation')}</label>
                <div className="email-capture-lead-generation-field-wrapper">
                    <TextControl />
                </div>
            </PanelRow>

        </PanelBody>
    );
}


export default Integration;
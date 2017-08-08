import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";

import { SearchBar } from "./SearchBar";
import { OfflineSearchContainerProps } from "./OfflineSearchContainer";
import { ValidateConfigs } from "./ValidateConfigs";
import "../ui/OfflineSearch.css";
import { CommonProps, HybridConstraint, ListView, OfflineSearchState, parseStyle } from "../utils/ContainerUtils";

export class OfflineSearch extends Component<OfflineSearchContainerProps, OfflineSearchState> {
    constructor(props: OfflineSearchContainerProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingWidget: true
        };

        this.updateConstraints = this.updateConstraints.bind(this);
    }

    render() {
        return createElement("div", null,
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchContainerProps,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName,
                validate: !this.state.findingWidget
            }),
            createElement(SearchBar, {
                ...this.props as CommonProps,
                onTextChangeAction: this.updateConstraints,
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(this.props, queryNode);
        let targetGrid: ListView | null = null;

        if (targetNode) {
            this.setState({ targetNode });
            targetGrid = dijitRegistry.byNode(targetNode);
            if (targetGrid) {
                this.setState({ targetGrid });
            }
        }

        this.setState({ findingWidget: false });
    }

    private updateConstraints(query: string) {
        let constraints: HybridConstraint | string = [];

        if (this.state.targetGrid && this.state.targetGrid._datasource) {
            const datasource = this.state.targetGrid._datasource;
            if (window.device) {
                constraints.push({
                    attribute: this.props.searchAttribute,
                    operator: this.props.searchMethod,
                    path: this.props.searchEntity,
                    value: query
                });
                datasource._constraints = query ? constraints : [];
            } else {
                constraints = this.props.searchEntity
                    ? `${this.props.searchEntity}[${this.props.searchMethod}(${this.props.searchAttribute},'${query}')]`
                    : `${this.props.searchMethod}(${this.props.searchAttribute},'${query}')`;
                datasource._constraints = query ? "[" + constraints + "]" : "";
            }

            this.state.targetGrid.update();
        }
    }
}
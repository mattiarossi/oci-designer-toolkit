/*
** Copyright (c) 2020, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded OKIT Designer View Javascript');

class OkitDesignerJsonView extends OkitJsonView {
    // Define Constants
    static get CANVAS_SVG() {return 'canvas-svg'}

    constructor(okitjson=null, parent_id = 'canvas-div', display_grid = false, palette_svg = []) {
        super(okitjson);
        this.parent_id = parent_id;
        this.display_grid = display_grid;
        this.palette_svg = palette_svg;
    }

    static newView(model, parent_id, display_grid = false, palette = []) {
        return new OkitDesignerJsonView((model, parent_id, display_grid, palette))
    }

    draw() {
        console.log('Drawing Designer Canvas');
        console.info(this);
        // Display Json
        this.displayOkitJson();
        // New canvas
        let width = 0;
        let height = 0;
        for (let compartment of this.compartments) {
            console.info(`Processing ${compartment.artefact.display_name}`);
            let dimensions = compartment.dimensions;
            width = Math.max(width, dimensions.width);
            height = Math.max(height, dimensions.height);
        }
        let canvas_svg = this.newCanvas(width, height);

        // Draw Compartments
        for (let compartment of this.compartments) {
            compartment.draw();
        }

        // Draw Compartment Sub Components
        // Virtual Cloud Networks
        for (let virtual_cloud_network of this.virtual_cloud_networks) {
            virtual_cloud_network.draw();
        }
        // Block Storage Volumes
        for (let block_storage_volume of this.block_storage_volumes) {
            block_storage_volume.draw();
        }
        // Object Storage Buckets
        for (let object_storage_bucket of this.object_storage_buckets) {
            object_storage_bucket.draw();
        }
        // Customer Premise Equipment
        for (let customer_premise_equipment of this.customer_premise_equipments) {
            customer_premise_equipment.draw();
        }
        // FastConnects
        for (let fast_connect of this.fast_connects) {
            fast_connect.draw();
        }
        // IPSec Connections
        for (let ipsec_connection of this.ipsec_connections) {
            ipsec_connection.draw();
        }
        // Remote Peering Connections
        for (let remote_peering_connection of this.remote_peering_connections) {
            remote_peering_connection.draw();
        }

        // Draw Virtual Cloud Network Sub Components
        // Internet Gateways
        for (let internet_gateway of this.internet_gateways) {
            internet_gateway.draw();
        }
        // NAT Gateways
        for (let nat_gateway of this.nat_gateways) {
            nat_gateway.draw();
        }
        // Service Gateways
        for (let service_gateway of this.service_gateways) {
            service_gateway.draw();
        }
        // Dynamic Routing Gateways
        for (let dynamic_routing_gateway of this.dynamic_routing_gateways) {
            dynamic_routing_gateway.draw();
        }
        // Local Peering Gateways
        for (let local_peering_gateway of this.local_peering_gateways) {
            local_peering_gateway.draw();
        }
        // Route Tables
        for (let route_table of this.route_tables) {
            route_table.draw();
        }
        // Security Lists
        for (let security_list of this.security_lists) {
            security_list.draw();
        }
        // Network Security Groups
        for (let network_security_group of this.network_security_groups) {
            network_security_group.draw();
        }
        // Subnets
        for (let subnet of this.subnets) {
            subnet.draw();
        }
        // OKE Clusters
        for (let oke_cluster of this.oke_clusters) {
            oke_cluster.draw();
        }

        // Draw Subnet Sub Components
        // Database System
        for (let database_system of this.database_systems) {
            database_system.draw();
        }
        // File Storage System
        for (let file_storage_system of this.file_storage_systems) {
            file_storage_system.draw();
        }
        // Instances
        for (let instance of this.instances) {
            instance.draw();
        }
        // Instance Pools
        for (let instance_pool of this.instance_pools) {
            instance_pool.draw();
        }
        // Load Balancers
        for (let load_balancer of this.load_balancers) {
            load_balancer.draw();
        }
        // Autonomous Databases
        for (let autonomous_database of this.autonomous_databases) {
            autonomous_database.draw();
        }
        // MySQL Database System
        for (let mysql_database_system of this.mysql_database_systems) {
            mysql_database_system.draw();
        }

        // Resize Main Canvas if required
        console.info('Canvas Width   : ' + canvas_svg.attr('width'));
        console.info('Canvas Height  : ' + canvas_svg.attr('height'));
        console.info('Canvas viewBox : ' + canvas_svg.attr('viewBox'));
        $(jqId("canvas-svg")).children("svg [data-type='" + Compartment.getArtifactReference() + "']").each(function () {
            console.info('Id      : ' + this.getAttribute('id'));
            console.info('Width   : ' + this.getAttribute('width'));
            console.info('Height  : ' + this.getAttribute('height'));
            console.info('viewBox : ' + this.getAttribute('viewBox'));
            canvas_svg.attr('width', Math.max(Number(canvas_svg.attr('width')), Number(this.getAttribute('width'))));
            canvas_svg.attr('height', Math.max(Number(canvas_svg.attr('height')), Number(this.getAttribute('height'))));
            canvas_svg.attr('viewBox', '0 0 ' + canvas_svg.attr('width') + ' ' + canvas_svg.attr('height'));
        });
        console.info('Canvas Width   : ' + canvas_svg.attr('width'));
        console.info('Canvas Height  : ' + canvas_svg.attr('height'));
        console.info('Canvas viewBox : ' + canvas_svg.attr('viewBox'));
        if (selectedArtefact) {
            $(jqId(selectedArtefact)).toggleClass('highlight');
        }

        console.info(this);
        // Draw Connection
        this.drawConnections();
        console.log();
    }

    drawConnections() {
        // IPSec Connections
        for (let ipsec_connection of this.ipsec_connections) {
            ipsec_connection.drawConnections();
        }
        // Remote Peering Connections
        for (let remote_peering_connection of this.remote_peering_connections) {
            remote_peering_connection.drawConnections();
        }
        // Fast Connects
        for (let fast_connect of this.fast_connects) {
            fast_connect.drawConnections();
        }
        // Load Balancers
        for (let load_balancer of this.load_balancers) {
            load_balancer.drawConnections();
        }
        // Local Peering Connections
        for (let local_peering_gateway of this.local_peering_gateways) {
            local_peering_gateway.drawConnections();
        }
    }

    /*
    ** Draw Functions for each specific Artefact
     */
    drawRootCompartment() {
        this.drawCompartments(null);
    }
    drawCompartments(parent_id) {
        for (let compartment of this.compartments) {
            if (compartment.compartment_id === parent_id) {
                compartment.draw();
                // Draw Sub Compartments
            }
        }
    }

    displayOkitJson() {}

    newCanvas(width=400, height=300) {
        console.log('New Canvas');
        console.info('Parent                : ' + this.parent_id);
        console.info('Width                 : ' + width);
        console.info('Height                : ' + height);
        let canvas_div = d3.select(d3Id(this.parent_id));
        let parent_width  = $(jqId(this.parent_id)).width();
        let parent_height = $(jqId(this.parent_id)).height();
        width  = Math.round(Math.max(width, parent_width));
        height = Math.round(Math.max(height, parent_height));
        console.info('Width                 : ' + width);
        console.info('Height                : ' + height);
        // Round up to next grid size to display full grid.
        if (okitSettings.is_display_grid) {
            width += (grid_size - (width % grid_size) + 1);
            height += (grid_size - (height % grid_size) + 1);
        }
        console.info('Default Canvas Width  : ' + default_canvas_width);
        console.info('Default Canvas Height : ' + default_canvas_height);
        console.info('JQuery Parent Width   : ' + $(jqId(this.parent_id)).width());
        console.info('JQuery Parent Height  : ' + $(jqId(this.parent_id)).height());
        console.info('Client Parent Width   : ' + document.getElementById(this.parent_id).clientWidth);
        console.info('Client Parent Height  : ' + document.getElementById(this.parent_id).clientHeight);
        console.info('Window Width          : ' + $(window).width());
        console.info('Window Height         : ' + $(window).height());
        console.info('Canvas Width          : ' + width);
        console.info('Canvas Height         : ' + height);
        // Empty existing Canvas
        canvas_div.selectAll('*').remove();
        // Wrapper SVG Element to define ViewBox etc
        let canvas_svg = canvas_div.append("svg")
            .attr("id", 'canvas-svg')
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMin meet");

        this.clearCanvas();
        console.log();

        return canvas_svg;
    }

    clearCanvas() {
        let canvas_svg = d3.select(d3Id(OkitDesignerJsonView.CANVAS_SVG));
        canvas_svg.selectAll('*').remove();
        this.styleCanvas(canvas_svg);
        this.addDefinitions(canvas_svg);
        canvas_svg.append('rect')
            .attr("id", "canvas-rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white");
        if (this.display_grid) {
            this.addGrid(canvas_svg);
        }
    }

    addDefinitions(canvas_svg) {
        // Add Palette Icons
        let defs = canvas_svg.append('defs');
        for (let key in this.palette_svg) {
            let defid = key.replace(/ /g, '') + 'Svg';
            defs.append('g')
                .attr("id", defid)
                //.attr("transform", "translate(-20, -20) scale(0.3, 0.3)")
                .attr("transform", "translate(-1, -1) scale(0.29, 0.29)")
                .html(this.palette_svg[key]);
        }
        // Add Connector Markers
        // Pointer
        let marker = defs.append('marker')
            .attr("id", "connector-end-triangle")
            .attr("viewBox", "0 0 100 100")
            .attr("refX", "1")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "35")
            .attr("markerHeight", "35")
            .attr("orient", "auto");
        marker.append('path')
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "black");
        // Circle
        marker = defs.append('marker')
            .attr("id", "connector-end-circle")
            .attr("viewBox", "0 0 100 100")
            .attr("refX", "5")
            .attr("refY", "5")
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", "35")
            .attr("markerHeight", "35")
            .attr("orient", "auto");
        marker.append('circle')
            .attr("cx", "5")
            .attr("cy", "5")
            .attr("r", "5")
            .attr("fill", connector_colour);
        // Grid
        let small_grid = defs.append('pattern')
            .attr("id", "small-grid")
            .attr("width", small_grid_size)
            .attr("height", small_grid_size)
            .attr("patternUnits", "userSpaceOnUse");
        small_grid.append('path')
            .attr("d", "M "+ small_grid_size + " 0 L 0 0 0 " + small_grid_size)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", "0.5");
        let grid = defs.append('pattern')
            .attr("id", "grid")
            .attr("width", grid_size)
            .attr("height", grid_size)
            .attr("patternUnits", "userSpaceOnUse");
        grid.append('rect')
            .attr("width", grid_size)
            .attr("height", grid_size)
            .attr("fill", "url(#small-grid)");
        grid.append('path')
            .attr("d", "M " + grid_size + " 0 L 0 0 0 " + grid_size)
            .attr("fill", "none")
            .attr("stroke", "darkgray")
            .attr("stroke-width", "1");
    }

    styleCanvas(canvas_svg) {
        let colours = '';
        for (let key in this.stroke_colours) {
            colours += '.' + key.replace(new RegExp('_', 'g'), '-') + '{fill:' + this.stroke_colours[key] + ';} ';
        }
        canvas_svg.append('style')
            .attr("type", "text/css")
            .text(colours + ' text{font-weight: normal; font-size: 10pt}');
    }
}

class OkitDesignerArtefactView extends OkitArtefactView {
    constructor(artefact=null, json_view) {
        super(artefact, json_view);
    }

    loadCustomerPremiseEquipments(select_id) {
        $(jqId(select_id)).empty();
        const cpe_select = $(jqId(select_id));
        cpe_select.append($('<option>').attr('value', '').text(''));
        for (const cpe of this.getOkitJson().getCustomerPremiseEquipments()) {
            cpe_select.append($('<option>').attr('value', cpe.id).text(cpe.display_name));
        }
    }

    loadDynamicRoutingGateways(select_id) {
        $(jqId(select_id)).empty();
        const drg_select = $(jqId(select_id));
        drg_select.append($('<option>').attr('value', '').text(''));
        for (const drg of this.getOkitJson().getDynamicRoutingGateways()) {
            drg_select.append($('<option>').attr('value', drg.id).text(drg.display_name));
        }
    }

    loadNetworkSecurityGroups(select_id, subnet_id) {
        $(jqId(select_id)).empty();
        let multi_select = d3.select(d3Id(select_id));
        if (subnet_id && subnet_id !== '') {
            let vcn = this.getOkitJson().getVirtualCloudNetwork(this.getOkitJson().getSubnet(subnet_id).vcn_id);
            for (let networkSecurityGroup of this.getOkitJson().network_security_groups) {
                if (networkSecurityGroup.vcn_id === vcn.id) {
                    let div = multi_select.append('div');
                    div.append('input')
                        .attr('type', 'checkbox')
                        .attr('id', safeId(networkSecurityGroup.id))
                        .attr('value', networkSecurityGroup.id);
                    div.append('label')
                        .attr('for', safeId(networkSecurityGroup.id))
                        .text(networkSecurityGroup.display_name);
                }
            }
        }
    }

    loadLoadBalancerShapes(select_id) {
        $(jqId(select_id)).empty();
        const lb_select = $(jqId(select_id));
        for (let shape of okitOciData.getLoadBalaancerShapes()) {
            lb_select.append($('<option>').attr('value', shape.name).text(shape.name));
        }
    }
}

class OkitContainerDesignerArtefactView extends OkitContainerArtefactView {
    constructor(artefact=null, json_view) {
        super(artefact, json_view);
    }
}

$(document).ready(function() {
    okitJsonView = new OkitDesignerJsonView();
});

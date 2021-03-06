export class SepackConfig {
    public templates: [Template]
    constructor(templates: [Template]) {
        this.templates = templates
    }
}

export class VersionApi {
    public name: string
    public version: string
    public templates: [Template]
    constructor(name: string, version: string, templates: [Template]) {
        this.name = name
        this.version = version
        this.templates = templates
    }
}

export class Template {
    public name: string
    public url: string
    public branch: string
    constructor(name: string, url: string, branch: string) {
        this.name = name
        this.url = url
        this.branch = branch
    }
}

export class Dependencies {
    public group: string
    public artifact: string
    public description: string
    public version: string
    constructor(group: string, artifact: string, description: string, version: string) {
        this.group = group
        this.artifact = artifact
        this.description = description
        this.version = version
    }
}

export class PackageSetup {
    public projectName: string
    public packageName: string
    public template: Template
    public dependencies: string[]

    constructor(projectName: string, packageName: string, template: Template) {
        this.projectName = projectName
        this.packageName = packageName
        this.template = template
    }
}
export class RepoConfig {
    public repoUrl: string
    public projectName: string
    public packageName: string
    constructor(repoUrl: string, projectName: string, packageName: string) {
        this.repoUrl = repoUrl
        this.projectName = projectName
        this.packageName = packageName
     }
}

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

    getName(): string {
        return `${this.group}:${this.artifact}:${this.version}`
    }

    getImplementation(): string {
        return `implementation ${this.getName}`
    }
}
export class RepoConfig {
    constructor(repoUrl, projectName, packageName) {
        this.repoUrl = repoUrl
        this.projectName = projectName;
        this.packageName = packageName;
    }
}

export class SepackConfig {
    constructor([template], [dependencies]) {
        this.template = template;
        this.dependencies = dependencies;
    }
}

export class Template {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
}

export class Dependencies {
    constructor(name, file, deps, version) {
        this.name = name;
        this.file = file;
        this.deps = deps;
        this.version = version;
    }
}
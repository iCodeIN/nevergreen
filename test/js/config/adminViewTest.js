var $ = require('jquery')
var adminView = require('../../../src/js/config/adminView')
var config = require('../../../src/js/config/config')

describe('view logic', function () {

    var adminController = { saveIncludedProjects: function(){},
                            getProjects: function(){},
                            saveSuccessText: function(){},
                            saveAllProjects: function(){}}

    beforeEach(function () {
        $('body').empty()
        $('body').append('<div id="projects"/>')
        localStorage.clear()
        view = adminView(adminController)
    })

    it('adds click listener to page', function () {
        localStorage.setItem('includedProjects', ['foo', 'bar'])
        localStorage.setItem('cctray', 'some-url')
        spyOn(window.location, 'replace')
        spyOn(adminController, 'saveSuccessText')
        spyOn(adminController, 'getProjects')
        $('body').append('<input id="save-projects"/>')
        $('body').append('<div id="projects"><ul>' +
            '<li class="included">proj-1</li>' +
            '<li class="included">proj-2</li>' +
            '<li>proj-3</li>' +
            '</ul></div>')

        view.init(config)
        $('#save-projects').click()

        expect(adminController.saveSuccessText).toHaveBeenCalled()
        expect(window.location.replace).toHaveBeenCalledWith('/')
    })

    it('autoloads projects if cctray is available', function () {
        localStorage.setItem('cctray', 'some-url')
        spyOn(adminController, 'getProjects')

        view.init(config)

        expect(adminController.getProjects).toHaveBeenCalled()
    })

    describe('spinner', function () {
        it('is shown', function () {
            $('body').append('<div id="loading-modal"></div><div id="spinner" style="display: none"></div>')

            view.showSpinner(true)

            expect($('#spinner')).toBeVisible()
            expect($('#loading-modal')).toHaveClass('loading')
        })

        it('is hidden', function () {
            $('body').append('<div id="loading-modal"></div><div id="spinner"></div>')

            view.showSpinner(false)

            expect($('#spinner')).not.toBeVisible()
            expect($('#loading-modal')).not.toHaveClass('loading')
        })
    })

    it('does not load projects if cctray is unavailable', function () {
        spyOn(adminController, 'getProjects')

        view.init(config)

        expect(adminController.getProjects).not.toHaveBeenCalled()
    })

    describe('cctray url', function() {
        it('saves', function () {
            $('body').append('<form>' +
            '<input id="cctray-url" type=text>' +
            '<input id="cctray-save" class=button type=button>' +
            '</form>')

            view.init(config)
            $('#cctray-url').val('   expected   ')
            $('#cctray-save').click()

            expect(localStorage.cctray).toBe('expected')
        })
    })

    describe('success text', function () {

        beforeEach(function () {
            $('body').append('<form>' +
               '<input id="success-text" type=text name=success-text/>' +
               '<input id="save-projects" class=button type=button>' +
               '</form>')
        })

        it('saves', function () {
            spyOn(window.location, 'replace')
            view.init(config)
            $('#success-text').val('expected')
            spyOn(adminController, 'saveSuccessText')

            $('#save-projects').click()

            expect(adminController.saveSuccessText).toHaveBeenCalledWith('expected')
        })

        it('loads', function () {
            localStorage.setItem('successText', 'any old value')
            var textInput = $('#success-text')

            view.init(config)

            expect(textInput.val()).toBe('any old value')
        })
    })

    it('prints a list of project names to the dom', function () {
        localStorage.setItem('allProjects', ['foo'])
        $('body').append('<div id="project-controls" class="hidden"></div>')
        view.appendProjects([
            {'name': 'foo'},
            {'name': 'bar'}
        ])

        expect($('#projects ul li').size()).toBe(2)
        expect($('#projects ul li:first').html()).toEqual('bar <sup>new</sup>')
        expect($('#projects ul li:last').text()).toEqual('foo')
        expect($('#project-controls')).not.toHaveClass('hidden')
    })

    it('clears out the projects before adding them', function () {
        view.appendProjects([{'name': 'foo'}, {'name': 'bar'}])
        view.appendProjects([{'name': 'foo'}, {'name': 'bar'}])

        expect($('#projects ul li').size()).toBe(2)
    })

    it('projects should only be included if the user has included them', function () {
        localStorage.setItem('includedProjects', ['foo'])
        localStorage.setItem('cctray', 'url')
        view.appendProjects([
            {'name': 'foo'},
            {'name': 'bar'}
        ])

        expect($('#projects ul li:first')).not.toHaveClass('included')
        expect($('#projects ul li:last')).toHaveClass('included')
    })

    describe('projects click', function () {
        it('project gets classes added', function () {
            view.appendProjects([
                {'name': 'foo'},
                {'name': 'bar'}
            ])
            var project = $('#projects ul li:first')
            expect(project).toHaveClass('included')
            expect(project).toHaveClass('no-text-selection')

            project.click()

            expect(project).not.toHaveClass('included')
        })

        it('project gets saved in local storage', function () {
            spyOn(adminController, 'saveIncludedProjects')
            view.appendProjects([
                {'name': 'bar'},
                {'name': 'foo'}
            ])
            var project = $('#projects ul li:first')

            project.click()

            expect(adminController.saveIncludedProjects).toHaveBeenCalledWith(['foo'])
        })
    })

    describe('include and exclude all buttons', function () {
        beforeEach(function () {
            spyOn(window.location, 'replace')
            $('body').empty()
            $('body').append('<input id="save-projects"/>')
            $('body').append('<input id="include-all"/>')
            $('body').append('<div id="projects"><ul>' +
            '<li>proj-1</li>' +
            '<li>proj-2</li>' +
            '<li>proj-3</li>' +
            '</ul></div>')
        })

        it('includes all click will add class included to all projects', function () {
            spyOn(adminController, 'saveIncludedProjects')

            view.init(config)
            $('#include-all').click()

            expect($('#projects ul li:last')).toHaveClass('included')
        })

        it('excludes all click will remove class included from all projects', function () {
            spyOn(adminController, 'saveIncludedProjects')

            view.init(config)
            $('#exclude-all').click()

            expect($('#projects ul li:first')).not.toHaveClass('included')
        })

        it('saves', function() {
            spyOn(adminController, 'saveIncludedProjects')

            view.init(config)
            view.appendProjects([{'name': 'foo'}])
            $('#include-all').click()

            expect(adminController.saveIncludedProjects).toHaveBeenCalledWith(['foo'])
        })
    })

})
